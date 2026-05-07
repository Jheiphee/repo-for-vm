const pool = require('../config/db');

const getPaymentById = async (req, res) => {

  try {

    // ✅ support both payment_id and id
    const { payment_id, id } = req.params || {};

    const finalId = payment_id || id;

    if (!finalId) {
      return res.status(400).json({
        success: false,
        message: 'payment_id is required'
      });
    }

    const result = await pool.query(
      `
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
      WHERE payment_id = $1
      `,
      [finalId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {

    console.error('GET PAYMENT BY ID ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getPaymentById;