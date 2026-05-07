const pool = require('../config/db');

const deletePayment = async (req, res) => {

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

    // 🔹 check payment exists
    const check = await pool.query(
      `
      SELECT *
      FROM payments
      WHERE payment_id = $1
      `,
      [finalId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // 🔥 delete payment
    await pool.query(
      `
      DELETE FROM payments
      WHERE payment_id = $1
      `,
      [finalId]
    );

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });

  } catch (err) {

    console.error('DELETE PAYMENT ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = deletePayment;