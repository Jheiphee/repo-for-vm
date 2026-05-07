const pool = require('../config/db');

const getAllProfiles = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM profiles
      ORDER BY profile_id ASC
    `);

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error('GET PROFILES ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getAllProfiles;