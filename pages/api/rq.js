// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Postgres client
import { connectToDatabase } from "utils/db";
const db = connectToDatabase();

//getauth from clerk!
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    let random = Math.random();
    // Get the user's orgID and userID (clerk.dev's capitalization is weird so rename it)
    // console.time(random);
    const { userId: userID, orgId: orgID } = getAuth(req);
    // console.timeLog(random);
    let rawQuery = req.query.query;
    let scopedQuery = `SELECT * FROM (${rawQuery}) unscoped WHERE unscoped.organization_id = '${orgID}'`;
    // console.log(scopedQuery);
    // console.log(scopedQuery);
    try {
        const results = (await db.query(scopedQuery)).rows;
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(200).json({ error: err });
    }
}
