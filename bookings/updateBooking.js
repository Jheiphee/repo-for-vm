const pool = require('../config/db');

const updateBooking = async (req, res) => {

  try {

    // ✅ support both booking_id and id
    const { booking_id, id } = req.params || {};

    const finalId = booking_id || id;

    if (!finalId) {
      return res.status(400).json({
        success: false,
        message: 'booking_id is required'
      });
    }

    const {
      number_of_guests,
      check_in_date,
      check_out_date,
      status
    } = req.body || {};

    // 🔹 check booking exists
    const check = await pool.query(
      `
      SELECT 1
      FROM bookings
      WHERE booking_id = $1
      `,
      [finalId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    let fields = [];
    let values = [];
    let index = 1;

    if (number_of_guests !== undefined) {
      fields.push(`number_of_guests = $${index++}`);
      values.push(number_of_guests);
    }

    if (check_in_date !== undefined) {
      fields.push(`check_in_date = $${index++}`);
      values.push(check_in_date);
    }

    if (check_out_date !== undefined) {
      fields.push(`check_out_date = $${index++}`);
      values.push(check_out_date);
    }

    if (status !== undefined) {
      fields.push(`status = $${index++}`);
      values.push(status);
    }

    // 🔹 no fields provided
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided for update'
      });
    }

    values.push(finalId);

    const query = `
      UPDATE bookings
      SET ${fields.join(', ')}
      WHERE booking_id = $${index}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('UPDATE BOOKING ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = updateBooking;