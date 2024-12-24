const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { checkJwt } = require("../config/auth");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

router.get("/data", checkJwt, async (req, res) => {
  try {
    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          authorization: req.headers.authorization,
        },
      }
    );
    const auth0Data = await response.json();

    const dbResult = await pool.query(
      "SELECT * FROM user_profiles WHERE auth0_id = $1",
      [auth0Data.sub]
    );

    if (dbResult.rows.length === 0) {
      await pool.query(
        "INSERT INTO user_profiles (auth0_id, name, email, picture) VALUES ($1, $2, $3, $4)",
        [auth0Data.sub, auth0Data.name, auth0Data.email, auth0Data.picture]
      );
    }

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

router.put("/data", checkJwt, async (req, res) => {
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

    // First update the database
    const result = await pool.query(
      `UPDATE user_profiles 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           additional_info = COALESCE($3, additional_info)
       WHERE auth0_id = $4
       RETURNING *`,
      [name, email, additional_info, sub]
    );

    // Then fetch the latest data to ensure consistency
    const updatedResult = await pool.query(
      "SELECT * FROM user_profiles WHERE auth0_id = $1",
      [sub]
    );

    const updatedUser = updatedResult.rows[0];

    res.json({
      message: "Profile updated successfully",
      user: {
        ...updatedUser,
        sub: sub, // Include Auth0 sub to maintain consistency
      },
    });
  } catch (error) {
    console.error("Error in PUT /api/data:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
});

module.exports = router;
