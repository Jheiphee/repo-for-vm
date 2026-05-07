const pool = require('../config/db');

const getBestRoomRevenue = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        r.room_number,
        SUM(p.payment_amount) AS total_revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.booking_id
      JOIN rooms r ON b.room_id = r.room_id
      GROUP BY r.room_number
      ORDER BY total_revenue DESC
      LIMIT 1
    `);

    res.status(200).json({
      success: true,
      data: result.rows[0] || null
    });

  } catch (err) {

    console.error('BEST ROOM REVENUE ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getBestRoomRevenue;