const { pool } = require("../config/database");

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

module.exports = { initDB };
