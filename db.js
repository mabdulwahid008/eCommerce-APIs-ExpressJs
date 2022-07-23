const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
    host : process.env.HOST,
    port : process.env.DB_PORT,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
})

module.exports = db
