import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

// Database connection
const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

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
  console.log(`Backend running on port ${port}`);
});