// Import the 'Pool' class from the pg library
const { Pool } = require('pg');

// Load environment variables
require('dotenv').config();

// Create a new connection pool with the configuration from our .env file
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Export the pool so other parts of our application can use it to run queries
module.exports = pool;