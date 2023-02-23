const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool ({
  host: process.env.PG_DB_HOST,
  port: process.env.PG_DB_PORT,
  database: process.env.PG_DB_DATABASE,
  user: process.env.PG_DB_USER,
  password: process.env.PG_DB_PASSWORD
});

module.exports = pool;