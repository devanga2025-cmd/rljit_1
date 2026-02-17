require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("JananiSetu Backend Server is Running!");
});

/* ================= DATABASE CONNECTION ================= */

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
});

pool.connect()
    .then(() => console.log("Connected to JananiSetu PostgreSQL Database"))
    .catch(err => console.error("Database connection error:", err));

/* ======================================================
   REGISTER - MOTHER
====================================================== */

app.post("/api/register/mother", async (req, res) => {
    console.log("POST /api/register/mother - Data:", { ...req.body, password: "****" });
    try {
        const {
            full_name,
            age,
            phone_number,
            village,
            location,
            blood_group,
            pre_existing_conditions,
            lmp_date,
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Inserting user...");
        const userResult = await pool.query(
            "INSERT INTO users (role, email, password) VALUES ($1, $2, $3) RETURNING id",
            ["mother", email, hashedPassword]
        );

        const userId = userResult.rows[0].id;
        console.log(`User created with ID: ${userId}. Inserting mother details...`);

        await pool.query(
            `INSERT INTO mothers
       (user_id, full_name, age, phone_number, village, location, blood_group, pre_existing_conditions, lmp_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [
                userId,
                full_name,
                age,
                phone_number,
                village,
                location,
                blood_group,
                pre_existing_conditions,
                lmp_date
            ]
        );

        console.log("Registration successful!");
        res.json({ message: "Mother registered successfully" });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: error.message || "Registration failed" });
    }
});

/* ======================================================
   REGISTER - FATHER
====================================================== */

app.post("/api/register/father", async (req, res) => {
    try {
        const {
            father_name,
            wife_name,
            wife_age,
            location,
            email,
            password
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const userResult = await pool.query(
            "INSERT INTO users (role, email, password) VALUES ($1,$2,$3) RETURNING id",
            ["father", email, hashedPassword]
        );

        const userId = userResult.rows[0].id;

        await pool.query(
            `INSERT INTO fathers
       (user_id, father_name, wife_name, wife_age, location)
       VALUES ($1,$2,$3,$4,$5)`,
            [userId, father_name, wife_name, wife_age, location]
        );

        res.json({ message: "Father registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Registration failed" });
    }
});

/* ======================================================
   REGISTER - HEALTH WORKER
====================================================== */

app.post("/api/register/healthworker", async (req, res) => {
    try {
        const {
            full_name,
            anganwadi_location,
            email,
            password
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const userResult = await pool.query(
            "INSERT INTO users (role, email, password) VALUES ($1,$2,$3) RETURNING id",
            ["health_worker", email, hashedPassword]
        );

        const userId = userResult.rows[0].id;

        await pool.query(
            `INSERT INTO health_workers
       (user_id, full_name, anganwadi_location)
       VALUES ($1,$2,$3)`,
            [userId, full_name, anganwadi_location]
        );

        res.json({ message: "Health Worker registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Registration failed" });
    }
});

/* ======================================================
   LOGIN (ALL ROLES)
====================================================== */

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            role: user.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
});

/* ======================================================
   GET ALL MOTHERS (For Health Workers)
====================================================== */

app.get("/api/mothers", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT m.*, u.email 
            FROM mothers m 
            JOIN users u ON m.user_id = u.id 
            ORDER BY m.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch mothers" });
    }
});

/* ======================================================
   START SERVER
====================================================== */

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`JananiSetu server running on http://127.0.0.1:${PORT}`);
    });
}

module.exports = app;
