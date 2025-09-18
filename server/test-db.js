const { Client } = require('pg');

const client = new Client({
  host: "prompt-db.cpogi46ikhf2.eu-north-1.rds.amazonaws.com",
  port: 5432,
  user: "postgres",
  password: "Iloveindia777&$*",
  database: "prompt_manager",
  ssl: { rejectUnauthorized: false } // ✅ Force SSL for AWS RDS
});

client.connect()
  .then(() => {
    console.log("✅ Connected successfully to RDS (SSL)!");
    return client.end();
  })
  .catch(err => {
    console.error("❌ Connection failed:", err);
  });
