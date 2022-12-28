// db.js
import postgres from "postgres";

const sql = postgres(
  process.env.PGCONNECTIONSTRING
  /* options */
); // will use psql environment variables

export default sql;
