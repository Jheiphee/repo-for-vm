const pool = require('../config/db');

const getAllGuests = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        guest_id,
        profile_id,
        guest_type,
        is_member
      FROM guests
      ORDER BY guest_id ASC
    `);

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error('GET GUESTS ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getAllGuests;