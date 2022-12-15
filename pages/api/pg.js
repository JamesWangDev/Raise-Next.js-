//pg.js

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from "../../utils/supabase";

export default async function handler(req, res) {
  console.time("supabase req timer");

  const config = {
    user: "postgres", // default process.env.PGUSER || process.env.USER
    password: process.env.PGPASSWORD,
    host: "db.hhvadsbsmfeutnvgvnrj.supabase.co", // default process.env.PGHOST
    database: "postgres", // default process.env.PGDATABASE || user
    port: "5432", // default process.env.PGPORT
  };

  const { Client } = require("pg");
  const client = new Client(config);
  await client.connect();

  const response = await client.query(
    `COPY testtable(text)
    FROM PROGRAM 'curl "https://hhvadsbsmfeutnvgvnrj.supabase.co/storage/v1/object/public/imports/test.csv"'
    DELIMITER ','
    CSV HEADER;`
  );
  // console.log(res.rows[0].message); // Hello world!
  console.timeEnd("supabase req timer");
  res.status(200).json(response);

  await client.end();
}
