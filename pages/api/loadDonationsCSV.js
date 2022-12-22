// UUID!
const { v4: uuid } = require("uuid");

// Papa parse for csv handling
const Papa = require("papaparse");

// Postgres client
import { connectToDatabase } from "../../utils/db";
const db = connectToDatabase();

// Supabase storage client
import supabase from "../../utils/supabase";

// List of columns in order from csv file
let permitTheseColumns = [
  "id",
  "batch_id",
  "receipt_id",
  "date",
  "amount",
  "recurring_total_months",
  "recurrence_number",
  "recipient",
  "fundraising_page",
  "fundraising_partner",
  "reference_code_2",
  "reference_code",
  "donor_first_name",
  "donor_last_name",
  "donor_addr1",
  "donor_addr2",
  "donor_city",
  "donor_state",
  "donor_zip",
  "donor_country",
  "donor_occupation",
  "donor_employer",
  "donor_email",
  "donor_phone",
  "new_express_signup",
  "comments",
  "check_number",
  "check_date",
  "employer_addr1",
  "employer_addr2",
  "employer_city",
  "employer_state",
  "employer_zip",
  "employer_country",
  "donor_id",
  "fundraiser_id",
  "fundraiser_recipient_id",
  "fundraiser_contact_email",
  "fundraiser_contact_first_name",
  "fundraiser_contact_last_name",
  "partner_id",
  "partner_contact_email",
  "partner_contact_first_name",
  "partner_contact_last_name",
  "lineitem_id",
  "ab_test_name",
  "ab_variation",
  "recipient_committee",
  "recipient_id",
  "recipient_gov_id",
  "recipient_election",
  "payment_id",
  "payment_date",
  "disbursement_id",
  "disbursement_date",
  "recovery_id",
  "recovery_date",
  "refund_id",
  "refund_date",
  "fee",
  "recur_weekly",
  "actblue_express_lane",
  "card_type",
  "mobile",
  "recurring_upsell_shown",
  "recurring_upsell_succeeded",
  "double_down",
  "smart_recurring",
  "monthly_recurring_amount",
  "apple_pay",
  "card_replaced_by_account_updater",
  "actblue_express_donor",
  "custom_field_1_label",
  "custom_field_1_value",
  "donor_us_passport_number",
  "text_message_opt_in",
  "gift_identifier",
  "gift_declined",
  "shipping_addr1",
  "shipping_city",
  "shipping_state",
  "shipping_zip",
  "shipping_country",
  "weekly_recurring_amount",
  "smart_boost_amount",
  "smart_boost_shown",
];

// Load csv of donations to donation and people table
// 12/19/22 Currently loading 60k donations from a 45mb file in 34 seconds
export default async function loadDonationsCSV(req, res) {
  // Assign a unique batch ID for transaction integrity
  const batchID = uuid();

  // Log the time of function execution
  console.time("functionexectime");
  console.log("------");
  console.log("loadDonationsCSV()");

  console.time("load file");

  // Get fileName from request query variable
  let {
    query: { fileName },
    method,
  } = req;

  // For testing
  // fileName = "rana-ab-backup.csv";
  console.log("fileName", fileName);

  // Get the file from supabase storage
  const { data: fileBlob, error } = await supabase.storage
    .from("public/imports")
    .download(fileName);
  let rawContent = await fileBlob.text();
  console.log("rawContent.length", rawContent.length);

  console.timeEnd("load file");

  console.time("parse file");

  // Fix the headers in the raw content
  var firstLine = rawContent.split("\n", 1)[0].trim();
  firstLine = firstLine.replaceAll(" ", "_").toLowerCase();
  rawContent = firstLine + rawContent.slice(rawContent.indexOf("\n"));

  // Data is the JSON, fields is an array of headers
  let {
    data: fileParsedToJSON,
    // meta: { fieldsb },
  } = Papa.parse(rawContent, { header: true, skipEmptyLines: true });

  console.timeEnd("parse file");

  console.time("edit file");

  // Add the batch ID
  fileParsedToJSON = fileParsedToJSON.map((row) => ({
    ...row,
    batch_id: batchID,
    // id: uuid(),
  }));

  // Loop through every row
  fileParsedToJSON.forEach((row, index) => {
    // Loop through every key
    Object.keys(row).forEach((key, j) => {
      // And drop every key that is not present in permitTheseColumns
      if (!permitTheseColumns.includes(key))
        delete fileParsedToJSON[index][key];
    });
  });

  // // Grab the people collection as an array of rows
  console.time("people get direct query");
  const people = (await db.query("select * from people")).rows;
  console.timeEnd("people get direct query");
  const oldPeople = JSON.parse(JSON.stringify(people));

  let updates = [];

  function matchExpression(person, index) {
    var isMatch = person.email == this.donation["donor_email"];
    if (isMatch) {
      console.log("this.matchingIndex", this.matchingIndex);
      console.log("index", index);
      this.matchingIndex = index;
    }
    return !!isMatch;
  }
  function matchExpressionByName(person, index) {
    var isMatch =
      person.first_name == this.donation["donor_first_name"] &&
      person.last_name == this.donation["donor_last_name"];
    if (isMatch) {
      console.log("this.matchingIndex", this.matchingIndex);
      console.log("index", index);
      this.matchingIndex = index;
    }
    return !!isMatch;
  }

  // // Loop through donation objects
  for (let index = 0; index < fileParsedToJSON.length; index++) {
    const donation = fileParsedToJSON[index];

    let passThrough = {
      matchingIndex: null,
      donation: donation,
    };

    let matchingPeople;
    let howManyMatchingPeople;

    // Does person already exist? Try by email
    if (!!donation["donor_email"]) {
      matchingPeople = people.filter(matchExpression, passThrough);
      howManyMatchingPeople = matchingPeople.length;
      console.log("howManyMatchingPeople", howManyMatchingPeople);

      if (howManyMatchingPeople > 1) {
        // Email isn't unique! Throw error
        console.error(donation);
        throw new Error("Email should be unique but was not");
      }
    } else {
      // Otherwise, try by name
      matchingPeople = people.filter(matchExpressionByName, passThrough);
      howManyMatchingPeople = matchingPeople.length;
    }

    // Placeholder for match index
    let matchingIndex = passThrough.matchingIndex;

    // Create an object to hold new information
    const newPerson = newPersonFromDonationObject(donation);

    // Placeholder for matching person's id to inject back into donation
    let personID;

    console.log("matchingIndex", matchingIndex);

    // If the donor already exists, grab existing id
    if (howManyMatchingPeople > 0) {
      personID = people[matchingIndex].id;

      // Record the overwrite
      people[matchingIndex] = JSON.parse(
        JSON.stringify({ ...newPerson, id: personID })
      );
    } else {
      // If the donor doesn't already exist, we want to create someone!
      // personID = (await accountDB.collection('people').add(newPerson)).id;
      personID = uuid();
      // Record a change a differnt way
      people.push(JSON.parse(JSON.stringify({ ...newPerson, id: personID })));
    }

    fileParsedToJSON[index]["person_id"] = personID;
  }

  console.timeEnd("edit file");

  console.time("unparse JSON to file");

  let updatedFileContents = Papa.unparse(fileParsedToJSON);

  console.timeEnd("unparse JSON to file");

  console.time("resave file and get url");

  // Write the CSV back to storage
  // ..now that we're sure it's compatible
  // and replace fileName with these cleaned file
  const updatedFileUploadResult = await supabase.storage
    .from("imports")
    .upload(batchID + ".csv", updatedFileContents, {
      upsert: true,
    });
  let sanitzedFileName = updatedFileUploadResult.data.path;

  console.log("updatedFileUploadResult", updatedFileUploadResult);

  // Store a signed URL to pass to PG as fileURL
  const {
    data: { publicUrl: fileURL },
  } = await supabase.storage.from("imports").getPublicUrl(sanitzedFileName);

  console.log("fileURL", fileURL);

  console.timeEnd("resave file and get url");

  console.time("donations queries");

  // Get the target columns parsed from csv into array
  let columns = updatedFileContents.split("\n", 1)[0].trim().split(",");
  var concatColumns = '"' + columns.join('", "') + '"';

  // Setup query
  let query = `
    COPY staging.donations(${concatColumns})
      FROM PROGRAM 'curl "${fileURL}"'
      DELIMITER ','
      CSV HEADER;
  `;

  // Open PG connection and safely close connection
  let result = await db.query(query);

  // next js test lines
  let successfulCopies = "rowCount" in result ? result.rowCount : 0;
  console.log("successfulCopies", successfulCopies);

  if (!(successfulCopies > 0)) {
    var error2 = "";
    console.error(error2);
    res.status(500).send(error2);
  }

  // Setup query to copy staging to production
  let stageToProductionQuery = `
      INSERT INTO public.donations
        SELECT * FROM staging.donations
        WHERE batch_id='${batchID}';
      DELETE FROM staging.donations WHERE batch_id='${batchID}';
    `;

  console.log(stageToProductionQuery);

  // Open PG connection and safely close connection
  let result2 = await db.query(stageToProductionQuery);
  console.log(result2);
  console.log("b");

  console.timeEnd("donations queries");

  console.time("upsert 7k records into people");

  // Insert differences
  // console.log("differences.length", differences.length);
  const { error4 } = await supabase.from("people").upsert(people);
  console.timeEnd("upsert 7k records into people");
  console.log("people insert error4:", error4);

  // //////////////////////////////////////////
  // // End handleDonationsCSVImport()
  console.timeEnd("functionexectime");
  res.send("ok");
}

// Standarized!
function newPersonFromDonationObject(data) {
  return {
    // Basic assignments
    last_name: data["donor_last_name"],
    first_name: data["donor_first_name"],
    email: data["donor_email"],
    phone: data["donor_phone"],
    employer: data["donor_employer"],
    occupation: data["donor_occupation"],

    // Address
    addr1: data["donor_addr1"],
    addr2: data["donor_addr2"],
    city: data["donor_city"],
    state: data["donor_state"],
    country: data["donor_country"],
    zip: data["Donor Zip"],
  };
}
