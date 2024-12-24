const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const { Pool } = require("pg");

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Auth0 middleware setup
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: "RS256",
  authRequired: true,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

// Initialize database table
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        auth0_id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        picture VARCHAR(255),
        additional_info JSONB DEFAULT '{}'::jsonb
      );
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

initDB();

// Get user profile data
app.get("/api/data", checkJwt, async (req, res) => {
  try {
    // Fetch user info from Auth0
    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          authorization: req.headers.authorization,
        },
      }
    );
    const auth0Data = await response.json();

    // Check if user exists in database
    const dbResult = await pool.query(
      "SELECT * FROM user_profiles WHERE auth0_id = $1",
      [auth0Data.sub]
    );

    if (dbResult.rows.length === 0) {
      // Create new user profile if it doesn't exist
      await pool.query(
        "INSERT INTO user_profiles (auth0_id, name, email, picture) VALUES ($1, $2, $3, $4)",
        [auth0Data.sub, auth0Data.name, auth0Data.email, auth0Data.picture]
      );
    }

    // Return combined data
    res.json({
      message: "Profile data retrieved successfully",
      user: {
        ...auth0Data,
        ...dbResult.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
app.put("/api/data", checkJwt, async (req, res, next) => {
  try {
    const { sub } = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          authorization: req.headers.authorization,
        },
      }
    ).then((res) => res.json());

    const { additional_info } = req.body;

    const result = await pool.query(
      `UPDATE user_profiles 
       SET additional_info = $1
       WHERE auth0_id = $2
       RETURNING *`,
      [additional_info, sub]
    );

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
