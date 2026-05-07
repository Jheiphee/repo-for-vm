const pool = require('../config/db');

const getBestRoomBookings = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        r.room_number,
        COUNT(b.booking_id) AS total_bookings
      FROM bookings b
      JOIN rooms r 
        ON b.room_id = r.room_id
      GROUP BY r.room_number
      ORDER BY total_bookings DESC
      LIMIT 1
    `);

    res.status(200).json({
      success: true,
      data: result.rows[0] || null
    });

  } catch (err) {

    console.error('BEST ROOM BOOKINGS ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getBestRoomBookings;