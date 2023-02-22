// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Postgres client
import { connectToDatabase } from "../../utils/db";
const db = connectToDatabase();

export default async function handler(req, res) {
    const results = (await db.query(req.query.query)).rows;
    res.status(200).json(results);
}
