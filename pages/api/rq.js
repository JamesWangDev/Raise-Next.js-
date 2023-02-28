// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Postgres client
import { connectToDatabase } from "utils/db";
const db = connectToDatabase();

//getauth from clerk!
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    // Get the user's orgID and userID (clerk.dev's capitalization is weird so rename it)
    const { userId: userID, orgId: orgID } = getAuth(req);

    let rawQuery = req.query.query;
    let scopedQuery =
        "SELECT * FROM (" + rawQuery + ") WHERE organization_id = '${orgID}'";
    const results = (await db.query(scopedQuery)).rows;
    res.status(200).json(results);
}
