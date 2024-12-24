const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const { Pool } = require("pg");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Database connection check function
const checkDatabaseConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log("✅ Successfully connected to PostgreSQL database!");

    // Test query
    const result = await client.query("SELECT NOW()");
    console.log("📅 Database time:", result.rows[0].now);

    // Check if user_profiles table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_profiles'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log("Creating user_profiles table...");
      await initDB();
    } else {
      console.log("✅ user_profiles table already exists");
      const userCount = await client.query(
        "SELECT COUNT(*) FROM user_profiles"
      );
      console.log(`📊 Current number of users: ${userCount.rows[0].count}`);
    }
  } catch (err) {
    console.error("❌ Database connection error:", err);
    console.error("Check your .env file and make sure PostgreSQL is running!");
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
  }
};

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
    console.log("✅ Database table initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
};

// Routes
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
    console.error("Error in GET /api/data:", error);
    res.status(500).json({
      message: "Error retrieving profile data",
      error: error.message,
    });
  }
});

// Update user profile
app.put("/api/data", checkJwt, async (req, res) => {
  try {
    const { sub } = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          authorization: req.headers.authorization,
        },
      }
    ).then((res) => res.json());

    const { name, email, additional_info } = req.body;
    console.log("📝 Updating profile for user:", sub);
    console.log("📝 Update data:", { name, email, additional_info });

    const result = await pool.query(
      `UPDATE user_profiles 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           additional_info = COALESCE($3, additional_info)
       WHERE auth0_id = $4
       RETURNING *`,
      [name, email, additional_info, sub]
    );

    console.log("✅ Profile updated successfully:", result.rows[0]);

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error in PUT /api/data:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
});

// Start server function
const startServer = async () => {
  try {
    // Check database connection before starting the server
    await checkDatabaseConnection();

    // Start the server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
