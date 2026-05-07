const pool = require('../config/db');

// ✅ normalize status
const normalizeStatus = (status) => {

  if (!status) return null;

  const map = {
    'pending': 'Pending',
    'partial_paid': 'Partial_paid',
    'paid': 'Paid',
    'refunded': 'Refunded'
  };

  return map[status.toLowerCase()] || null;

};

const createPayment = async (req, res) => {

  try {

    let {
      booking_id,
      payment_type,
      payment_method,
      payment_amount,
      total_discount = 0,
      status
    } = req.body || {};

    // 🔹 validation
    if (!booking_id || payment_amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'booking_id and payment_amount are required'
      });
    }

    // 🔹 normalize numbers
    payment_amount = Number(payment_amount);
    total_discount = Number(total_discount);

    // 🔹 check booking exists
    const bookingCheck = await pool.query(
      `
      SELECT 1
      FROM bookings
      WHERE booking_id = $1
      `,
      [booking_id]
    );

    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking does not exist'
      });
    }

    // 🔹 temporary total due
    const total_due = 5000;

    const final_due = total_due - total_discount;

    let finalStatus;

    const normalizedInputStatus = normalizeStatus(status);

    if (normalizedInputStatus) {

      finalStatus = normalizedInputStatus;

    } else {

      if (payment_amount === 0) {
        finalStatus = 'Pending';
      } else if (payment_amount < final_due) {
        finalStatus = 'Partial_paid';
      } else {
        finalStatus = 'Paid';
      }

    }

    // 🔥 insert payment
    const result = await pool.query(
      `
      INSERT INTO payments (
        booking_id,
        payment_date,
        payment_type,
        payment_method,
        payment_amount,
        total_discount,
        status
      )
      VALUES (
        $1,
        NOW(),
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING *
      `,
      [
        booking_id,
        payment_type,
        payment_method,
        payment_amount,
        total_discount,
        finalStatus
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('CREATE PAYMENT ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = createPayment;