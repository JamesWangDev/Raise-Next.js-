const config = {
    connectionString: process.env.PGCONNECTIONSTRING, // The following connection string enables pgbouncer, check .env
    application_name: "nextjs", // The name of the application that created this Client instance
    // connectionTimeoutMillis: 600, // number of milliseconds to wait for connection, default is no timeout
    // idle_in_transaction_session_timeout: 600, // number of milliseconds before terminating any session with an open idle transaction, default is no timeout
};

const { Pool } = require("pg");

if (!global.db) {
    global.db = { pool: null };
}

export function connectToDatabase() {
    if (!global.db.pool) {
        console.log("No DB connection pool available, creating new pool.");
        // Using .env PGHOST, PGPGPASSWORD, etc instead of var config={};
        global.db = new Pool(config);
        // the pool will emit an error on behalf of any idle clients
        // it contains if a backend error or network partition happens
        global.db.on("error", (err, client) => {
            console.error("Unexpected error on idle client", err);
            process.exit(-1);
        });
    }
    return global.db;
}
