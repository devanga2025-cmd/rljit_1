require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tables in DB:", res.rows.map(r => r.table_name));

        const users = await pool.query("SELECT * FROM users");
        console.log("User count:", users.rowCount);
        console.log("Users:", users.rows);
    } catch (err) {
        console.error("DB Test Error:", err);
    } finally {
        await pool.end();
    }
}

test();
