const pool = require('../config/db');

const getRoomById = async (req, res) => {

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

    const result = await pool.query(
      `
      SELECT *
      FROM rooms
      WHERE room_id = $1
      `,
      [finalId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {

    console.error('GET ROOM BY ID ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getRoomById;