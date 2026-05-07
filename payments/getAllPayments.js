const pool = require('../config/db');

const getAllPayments = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        payment_id,
        booking_id,
        payment_date,
        payment_type,
        payment_method,
        payment_amount,
        total_discount,
        status
      FROM payments
      ORDER BY payment_date DESC
    `);

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error('GET PAYMENTS ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getAllPayments;