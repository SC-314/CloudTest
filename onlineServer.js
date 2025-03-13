import express from "express";
import cors from "cors";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Database configuration using Render environment variables
const pool = new pg.Pool({
  user: process.env.DB_USER || "avnadmin",
  host: process.env.DB_HOST || "pg-ad9ba5b-testwebsite.e.aivencloud.com",
  database: process.env.DB_NAME || "defaultdb",
  password: process.env.DB_PASSWORD || "AVNS_pYxZ7PAgfojfKuVmn_D",
  port: process.env.DB_PORT || 13705,
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === "production" ? false : false
  }
});

// Serve static frontend files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  });
}

// API Endpoint
app.post("/counter", async (req, res) => {
  const { count } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO counter (counter) VALUES ($1) RETURNING *",
      [count]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});