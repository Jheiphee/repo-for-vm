const pool = require('../config/db');

const createProfile = async (req, res) => {

  try {

    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      marital_status,
      contact_number,
      profile_type
    } = req.body;

    // 🔹 validation
    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'first_name and last_name are required'
      });
    }

    // 🔥 insert profile
    const result = await pool.query(
      `
      INSERT INTO profiles (
        first_name,
        last_name,
        date_of_birth,
        gender,
        marital_status,
        contact_number,
        profile_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        first_name,
        last_name,
        date_of_birth || null,
        gender || null,
        marital_status || null,
        contact_number || null,
        profile_type || 'guest'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('CREATE PROFILE ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = createProfile;