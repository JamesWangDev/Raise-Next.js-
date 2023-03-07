import { getAuth } from "@clerk/nextjs/server";

// UUID!
const { v4: uuid } = require("uuid");

// Papa parse for csv handling
const Papa = require("papaparse");

// Postgres client
import { connectToDatabase } from "utils/db";
const db = connectToDatabase();

// Supabase storage client
import { createSupabaseClient } from "utils/supabaseHooks";

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
    // More people IDs to permit?
];

// Load csv of new people table
export default async function loadProspectsCSV(req, res) {
    // Get the user's orgID and userID (clerk.dev's capitalization is weird so rename it)
    const { userId: userID, orgId: orgID } = getAuth(req);

    // Clerk and supabase
    const supabase = createSupabaseClient(
        await getToken({
            template:
                process.env.NEXT_PUBLIC_ENVIRONMENT != "development"
                    ? "supabase"
                    : "supabase-local-development",
        })
    );

    // Assign a unique batch ID for transaction integrity
    const batchID = uuid();

    // Log the time of function execution
    console.time("functionexectime");
    console.log("------");
    console.log("loadProspectsCSV()");

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
    const { data: fileBlob, error: error } = await supabase.storage
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

    // Grab the people collection as an array of rows
    console.time("people get direct query");
    const people = (
        await db.query(`select * from people where organization_id='${orgID}'`)
    ).rows;
    console.timeEnd("people get direct query");

    // Add the batch ID
    fileParsedToJSON = fileParsedToJSON.map((row) => ({
        ...row,
        batch_id: batchID,
        organization_id: orgID,
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

    // Loop through every row of people table to do similarly for matching schema for upsert
    people.forEach((row, index) => {
        // Loop through every key
        Object.keys(row).forEach((key, j) => {
            // And drop every key that is not present in permitTheseColumns
            if (!permitTheseColumns.includes(key)) delete people[index][key];
        });
    });

    const oldPeople = JSON.parse(JSON.stringify(people));

    let updates = [];

    function matchExpression(person, index) {
        var isMatch = person.email == this.person["email"];
        if (isMatch) {
            console.log("this.matchingIndex", this.matchingIndex);
            console.log("index", index);
            this.matchingIndex = index;
        }
        return !!isMatch;
    }
    function matchExpressionByName(person, index) {
        var isMatch =
            person.first_name == this.person["first_name"] &&
            person.last_name == this.person["last_name"];
        if (isMatch) {
            console.log("this.matchingIndex", this.matchingIndex);
            console.log("index", index);
            this.matchingIndex = index;
        }
        return !!isMatch;
    }

    // // Loop through donation objects
    for (let index = 0; index < fileParsedToJSON.length; index++) {
        const person = fileParsedToJSON[index];
        if (!person["first_name"] || !person["last_name"]) continue;

        let passThrough = {
            matchingIndex: null,
            person: person,
        };

        let matchingPeople;
        let howManyMatchingPeople;

        // Does person already exist? Try by email
        if (!!people["email"]) {
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
        const newPerson = {
            ...newPersonFromPersonObject(person),
            batch_id: batchID,
            organization_id: orgID,
        };

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
            personID = uuid();
            people.push(
                JSON.parse(JSON.stringify({ ...newPerson, id: personID }))
            );
        }
    }

    console.log("people.length", people.length);
    if (people.length < 1) {
        console.log("no new people to insert");
        res.send("no new people to insert");
        return;
    }
    console.log(people);

    console.timeEnd("edit file");

    console.time("upsert records into people");

    // Insert differences...actually for now just upsert the whole table
    const { error: error4 } = await supabase
        .from("people")
        .upsert(people)
        .select();
    console.timeEnd("upsert records into people");
    console.log("people insert error4:", error4);

    console.timeEnd("functionexectime");
    res.send("ok");
}

// Standarized!
function newPersonFromPersonObject(data) {
    // This is a placeholder function for manipulating
    // column headers and adding metadata later
    const normalized = {
        first_name: data["first_name"] ? data["first_name"] : "",
        last_name: data["last_name"] ? data["last_name"] : "",
        zip: data["zip"] ? data["zip"] : "",
        email: data["email"] ? data["email"] : "",
        phone: data["phone"] ? data["phone"] : "",
    };
    return normalized;
}
