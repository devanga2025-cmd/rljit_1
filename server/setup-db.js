require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // Required for Supabase external connections
    }
});

async function setupDatabase() {
    try {
        console.log("Connecting to Supabase...");
        const schemaPath = path.join(__dirname, "schema.sql");
        const schema = fs.readFileSync(schemaPath, "utf8");

        console.log("Executing schema.sql...");
        await pool.query(schema);

        console.log("✅ Database tables created successfully in Supabase!");
    } catch (err) {
        console.error("❌ Error setting up database:", err.message);
    } finally {
        await pool.end();
    }
}

setupDatabase();
