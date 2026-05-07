const pool = require('../config/db');

const updatePayment = async (req, res) => {

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

    let {
      payment_type,
      payment_method,
      payment_amount,
      total_discount,
      status
    } = req.body || {};

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

    const current = check.rows[0];

    const amount = payment_amount !== undefined
      ? Number(payment_amount)
      : Number(current.payment_amount);

    const discount = total_discount !== undefined
      ? Number(total_discount)
      : Number(current.total_discount);

    const total_due = 5000;

    const final_due = total_due - discount;

    const STATUS_MAP = {
      pending: 'Pending',
      paid: 'Paid',
      partial: 'Paid',
      refunded: 'Paid',
      settlement: 'Paid'
    };

    let finalStatus = current.status;

    if (status) {

      const normalized = status.toLowerCase();

      if (STATUS_MAP[normalized]) {

        finalStatus = STATUS_MAP[normalized];

      } else {

        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });

      }

    } else {

      if (amount === 0) {
        finalStatus = 'Pending';
      } else if (amount < final_due) {
        finalStatus = 'Paid';
      } else {
        finalStatus = 'Paid';
      }

    }

    // 🔥 update payment
    const result = await pool.query(
      `
      UPDATE payments
      SET
        payment_type = COALESCE($1, payment_type),
        payment_method = COALESCE($2, payment_method),
        payment_amount = COALESCE($3, payment_amount),
        total_discount = COALESCE($4, total_discount),
        status = $5
      WHERE payment_id = $6
      RETURNING *
      `,
      [
        payment_type || null,
        payment_method || null,
        payment_amount ?? null,
        total_discount ?? null,
        finalStatus,
        finalId
      ]
    );

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('UPDATE PAYMENT ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = updatePayment;