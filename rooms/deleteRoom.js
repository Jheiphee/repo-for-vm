const pool = require('../config/db');

const deleteRoom = async (req, res) => {

  try {

    // ✅ support both room_id and id
    const { room_id, id } = req.params || {};

    const finalId = room_id || id;

    if (!finalId) {
      return res.status(400).json({
        success: false,
        message: 'room_id is required'
      });
    }

    // 🔹 check if room exists
    const check = await pool.query(
      `
      SELECT *
      FROM rooms
      WHERE room_id = $1
      `,
      [finalId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // 🔹 check if room is used in bookings
    const bookingCheck = await pool.query(
      `
      SELECT 1
      FROM bookings
      WHERE room_id = $1
      LIMIT 1
      `,
      [finalId]
    );

    if (bookingCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with existing bookings'
      });
    }

    // 🔥 delete room
    await pool.query(
      `
      DELETE FROM rooms
      WHERE room_id = $1
      `,
      [finalId]
    );

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });

  } catch (err) {

    console.error('DELETE ROOM ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = deleteRoom;