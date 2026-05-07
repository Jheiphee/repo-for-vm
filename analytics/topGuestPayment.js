const pool = require('../config/db');

const getTopGuestPayment = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        p.first_name,
        p.last_name,
        SUM(pay.payment_amount) AS total_payment
      FROM payments pay
      JOIN bookings b 
        ON pay.booking_id = b.booking_id
      JOIN guests g 
        ON b.guest_id = g.guest_id
      JOIN profiles p 
        ON g.profile_id = p.profile_id
      GROUP BY p.first_name, p.last_name
      ORDER BY total_payment DESC
      LIMIT 1
    `);

    res.status(200).json({
      success: true,
      data: result.rows[0] || null
    });

  } catch (err) {

    console.error('TOP GUEST PAYMENT ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getTopGuestPayment;