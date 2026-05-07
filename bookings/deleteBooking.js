const pool = require('../config/db');

const deleteBooking = async (req, res) => {

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

    const result = await pool.query(
      `
      DELETE FROM bookings
      WHERE booking_id = $1
      RETURNING *
      `,
      [finalId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('DELETE BOOKING ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = deleteBooking;