// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Postgres client
import { connectToDatabase } from "utils/db";
const db = connectToDatabase();
import jwt_decode from "jwt-decode";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    // Get the user's orgID (clerk.dev's capitalization is weird so rename it)
    const { orgId: orgID, getToken } = getAuth(req);

    // No unauthorized access
    if (!orgID) return res.status(401).send();

    // Clerk and supabase
    const supabaseJWTToken = await getToken({
        template:
            process.env.NEXT_PUBLIC_ENVIRONMENT != "development"
                ? "supabase"
                : "supabase-local-development",
    });
    const decoded = jwt_decode(supabaseJWTToken);

    // Direct connection
    const client = await db.connect();
    const authQuery = `BEGIN;set role authenticated;set request.jwt.claims to '${JSON.stringify(
        decoded
    )}';`;
    let rawQuery = req.query.query;

    // console.log(authQuery + rawQuery);

    try {
        // await client.query(authQuery);
        const results = await client.query(authQuery + rawQuery + "; END;");
        client.release();
        res.status(200).json(results[3].rows);
    } catch (err) {
        console.error(err);
        client.release();
        res.status(200).json({ error: err });
    }
}
