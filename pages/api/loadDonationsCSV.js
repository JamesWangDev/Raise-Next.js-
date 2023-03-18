export const config = { runtime: "edge" };
import { getAuth } from "@clerk/nextjs/server";
const { v4: uuid } = require("uuid");
const Papa = require("papaparse"); // Handles csvs
import { createSupabaseClient } from "lib/supabaseHooks";
import { EMAIL_VALIDATION_REGEX } from "lib/validation";
// List of columns in order from csv file
let permitTheseColumns = [
    "id",
    "batch_id",
    "organization_id",
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
export default async function loadDonationsCSV(req, res) {
    const { searchParams } = new URL(req.url);
    let fileName = searchParams.get("fileName");

    // Clerk
    const { orgId: orgID, getToken, userId: userID } = getAuth(req);

    // No unauthorized access
    if (!orgID) return res.status(401).send();

    // Supabase
    const supabase = createSupabaseClient(
        await getToken({
            template:
                process.env.NEXT_PUBLIC_ENVIRONMENT != "development"
                    ? "supabase"
                    : "supabase-local-development",
        })
    );
    const supabaseServiceRole = createSupabaseClient(null, { serviceRole: true });

    // Assign a unique batch ID for transaction integrity
    const batchID = uuid();
    console.log({ batchID });
    supabase
        .from("import_batches")
        .insert([{ id: batchID, file_url: fileName, organization_id: orgID, user_id: userID }]);

    // Log the time of function execution
    console.time("functionexectime");
    console.log("------");
    console.log("loadDonationsCSV()");

    console.time("load file");
    // Get the file from supabase storage
    const { data: fileBlob, error } = await supabaseServiceRole.storage
        .from("public/imports")
        .download(fileName);
    let rawContent = await fileBlob.text();
    console.log("rawContent.length", rawContent.length);
    console.timeEnd("load file");

    console.time("parse file");
    // Fix the headers in the raw content
    var renamedColumnsHeader = rawContent
        .split("\n", 1)[0]
        .trim()
        .replaceAll(" ", "_")
        .toLowerCase();
    rawContent = renamedColumnsHeader + rawContent.slice(rawContent.indexOf("\n"));
    let { data: fileParsedToJSON } = Papa.parse(rawContent, { header: true, skipEmptyLines: true });
    console.timeEnd("parse file");

    console.time("edit file");
    // Add the batch ID
    fileParsedToJSON = fileParsedToJSON.map((row) => ({
        ...row,
        batch_id: batchID,
        organization_id: orgID,
    }));

    // Loop through every row and drop every key that is not present in permitTheseColumns
    fileParsedToJSON = stripKeys(fileParsedToJSON, permitTheseColumns);

    // Grab the people collection as an array of rows
    console.time("people query");
    const { data: people } = await supabaseServiceRole
        .from("people")
        .select("*, emails (*), phone_numbers(*)")
        .eq("organization_id", orgID);
    console.timeEnd("people query");

    // Hashmap by email and fullname
    const hashByEmail = new Map();
    const hashByFullname = new Map();
    people.forEach((person, i) => {
        hashByFullname.set(person.first_name + "|" + person.last_name, i);
        for (const emailRecord of person.emails) {
            hashByEmail.set(emailRecord.email, i);
        }
    });

    // Keep track of who has been updated
    const peopleIndexesToUpsert = [],
        newEmails = [],
        newPhones = [];

    // Loop through donation objects
    for (let index = 0; index < fileParsedToJSON.length; index++) {
        const donation = fileParsedToJSON[index];

        // Create an object to hold new information, desctructre to remove the email and phone
        const { email, phone, ...newPerson } = {
            ...newPersonFromDonationObject(donation),
            batch_id: batchID,
            organization_id: orgID,
        };

        // Does person already exist? Try by email and fullname and only coalesce to default upon nullish (?? instead of ||)
        let matchingIndex = email
            ? hashByEmail.get(email) ?? people.length
            : hashByFullname.get(donation?.donor_first_name + "|" + donation?.donor_last_name) ??
              people.length;

        // If the person doesn't already exist, assign them a new UUID
        const personID = matchingIndex == people.length ? uuid() : people[matchingIndex].id;

        // Update person with donor info from donation
        const oldPerson = people[matchingIndex];
        people[matchingIndex] = { ...oldPerson, ...newPerson, id: personID };

        // If email isn't present, upload it
        if (!hashByEmail.has(email) && EMAIL_VALIDATION_REGEX.test(email)) {
            const newEmailRecord = {
                email: email,
                person_id: personID,
                primary_for: personID,
                batch_id: batchID,
            };
            const oldEmails = people[matchingIndex]?.emails || [];
            people[matchingIndex].emails = [...oldEmails, newEmailRecord];
            newEmails.push(newEmailRecord);
        }
        // Phones
        const validated_phone_number = Number(phone.toString().replaceAll("[^0-9]", ""));
        const phoneIsValid = validated_phone_number.toString().length === 10;
        // console.log(validated_phone_number);
        // console.log(
        //     !people[matchingIndex]?.phone_numbers
        //         ?.map((phoneRecord) => phoneRecord.phone_number.toString().replaceAll("[^0-9]", ""))
        //         .includes(validated_phone_number.toString())
        // );

        if (
            phoneIsValid &&
            (matchingIndex == people.length ||
                !people[matchingIndex]?.phone_numbers
                    ?.map((phoneRecord) =>
                        phoneRecord.phone_number.toString().replaceAll("[^0-9]", "")
                    )
                    .includes(validated_phone_number.toString()))
        ) {
            const newPhoneRecord = {
                phone_number: validated_phone_number,
                person_id: personID,
                batch_id: batchID,
            };
            const oldPhones = people[matchingIndex]?.phone_numbers || [];
            people[matchingIndex].phone_numbers = [...oldPhones, newPhoneRecord];
            newPhones.push(newPhoneRecord);
        }
        // TODO: else {throw a validation error;}

        // Adjust name and email hashes for future searches
        hashByFullname.set(newPerson.first_name + "|" + newPerson.last_name, matchingIndex);
        if (email) hashByEmail.set(email, matchingIndex);

        // Keep track of the changes we've made to people, and inject its id as new donation object's foreign key
        peopleIndexesToUpsert.push(matchingIndex);
        fileParsedToJSON[index].person_id = personID;
        // console.log({ matchingIndex });
    }
    console.timeEnd("edit file");

    // OK we are actually going to insert People first bc of foreign key
    console.time("upsert records into people");

    let peopleToUpsert = [...new Set(peopleIndexesToUpsert)].map(
        (recordIndex) => people[recordIndex]
    );
    // Strip keys not present in newPersonFromDonationObject()
    peopleToUpsert = stripKeys(
        peopleToUpsert,
        Object.keys({ ...newPersonFromDonationObject(), id: null })
    );

    const peopleInsertResults = await supabase
        .from("people")
        .upsert(peopleToUpsert, { ignoreDuplicates: false })
        .select("id");
    if (peopleInsertResults?.error) throw peopleInsertResults.error;

    const phoneInsertResults = await supabase
        .from("phone_numbers")
        .upsert(newPhones, { ignoreDuplicates: false })
        .select("id");
    if (phoneInsertResults?.error) throw phoneInsertResults.error;

    const emailsInsertResults = await supabase
        .from("emails")
        .upsert(newEmails, { ignoreDuplicates: false })
        .select("id");
    if (emailsInsertResults?.error) throw emailsInsertResults.error;

    console.timeEnd("upsert records into people");

    console.time("upload donations to db");
    const chunkSize = 100;
    const donationsInsertResults = [];
    for (let i = 0; i < fileParsedToJSON.length; i += chunkSize) {
        donationsInsertResults.push(
            supabase.from("donations").insert(fileParsedToJSON.slice(i, i + chunkSize))
        );
    }
    await Promise.allSettled(donationsInsertResults);
    console.timeEnd("upload donations to db");

    await supabase
        .from("import_batches")
        .upsert([{ id: batchID, finalized: new Date().toISOString() }]);
    console.timeEnd("functionexectime");

    // res.send(`File uploaded successfully, and ${fileParsedToJSON.length} records processed.`);
    return new Response(
        `File uploaded successfully, and ${fileParsedToJSON.length} records processed.`
    );
}

// Standarized!
function newPersonFromDonationObject(donation) {
    return {
        // Basic assignments
        last_name: donation?.donor_last_name.trim(),
        first_name: donation?.donor_first_name.trim(),
        email: donation?.donor_email.trim(),
        phone: donation?.donor_phone.trim(),
        employer: donation?.donor_employer.trim(),
        occupation: donation?.donor_occupation.trim(),

        // Address
        addr1: donation?.donor_addr1.trim(),
        addr2: donation?.donor_addr2.trim(),
        city: donation?.donor_city.trim(),
        state: donation?.donor_state.trim(),
        country: donation?.donor_country.trim(),
        zip: donation?.donor_zip.trim(),
    };
}

function stripKeys(arr, permitTheseKeys) {
    arr.forEach((row, index) => {
        for (const key in row) {
            if (!permitTheseKeys.includes(key)) delete arr[index][key];
        }
    });
    return arr;
}
