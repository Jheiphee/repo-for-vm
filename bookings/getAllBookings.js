const pool = require('../config/db');

const getAllBookings = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM bookings
      ORDER BY check_in_date DESC
    `);

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error('GET BOOKINGS ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getAllBookings;