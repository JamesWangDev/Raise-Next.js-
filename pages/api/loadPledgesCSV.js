// Switching to pledges over prospects to mirror the pledge=donation
// relational structure of the other import code
// TODO: refactor both files together to separate concerns/repetitive code

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
    "first_name",
    "last_name",
    "zip",
    "email",
    "phone",
    "pledge",
    "amount",
    // More people IDs to permit?
];

// Standarized!
function newPersonFromPledgeObject(data) {
    // This is a placeholder function for manipulating
    // column headers and adding metadata later
    const normalized = {
        first_name: data?.first_name,
        last_name: data?.last_name,
        zip: data?.zip,
        email: data?.email,
        phone: data?.phone,
    };
    return normalized;
}

// Load csv of pledges and people table
export default async function loadPledgesCSV(req, res) {
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
    console.log("loadProspectsCSV()");

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

    // Loop through pledge objects
    for (let index = 0; index < fileParsedToJSON.length; index++) {
        const pledge = fileParsedToJSON[index];

        // Create an object to hold new information, desctructre to remove the email and phone
        const { email, phone, ...newPerson } = {
            ...newPersonFromPledgeObject(pledge),
            batch_id: batchID,
            organization_id: orgID,
        };

        // Does person already exist? Try by email and fullname and only coalesce to default upon nullish (?? instead of ||)
        let matchingIndex = email
            ? hashByEmail.get(email) ?? people.length
            : hashByFullname.get(newPerson?.first_name + "|" + newPerson?.last_name) ??
              people.length;

        // If the person doesn't already exist, assign them a new UUID
        const personID = matchingIndex == people.length ? uuid() : people[matchingIndex].id;

        // Update person with donor info from pledge
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
        const validated_phone_number = Number(phone?.toString().replaceAll("[^0-9]", ""));
        const phoneIsValid = validated_phone_number?.toString().length === 10;
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

        // Keep track of the changes we've made to people, and inject its id as new pledge object's foreign key
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
    // Strip keys not present in newPersonFromPledgeObject()
    peopleToUpsert = stripKeys(
        peopleToUpsert,
        Object.keys({ ...newPersonFromPledgeObject(), id: null })
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

    console.time("upload pledges to db");
    const chunkSize = 100;
    const pledgesInsertResults = [];
    const pledgesToInsert = stripKeys(fileParsedToJSON, ["person_id", "amount"]);
    // console.log({ pledgesToInsert });
    for (let i = 0; i < pledgesToInsert.length; i += chunkSize) {
        pledgesInsertResults.push(
            supabase.from("pledges").insert(pledgesToInsert.slice(i, i + chunkSize))
        );
    }
    // TODO: Need better error handling:
    console.log(await Promise.allSettled(pledgesInsertResults));
    console.timeEnd("upload pledges to db");

    await supabase
        .from("import_batches")
        .upsert([{ id: batchID, finalized: new Date().toISOString() }]);
    console.timeEnd("functionexectime");

    // res.send(`File uploaded successfully, and ${fileParsedToJSON.length} records processed.`);
    return new Response(
        `File uploaded successfully, and ${fileParsedToJSON.length} records processed.`
    );
}

function stripKeys(arr, permitTheseKeys) {
    arr.forEach((row, index) => {
        for (const key in row) {
            if (!permitTheseKeys.includes(key)) delete arr[index][key];
        }
    });
    return arr;
}
