const pool = require('../config/db');

const createRoom = async (req, res) => {

  try {

    const {
      room_number,
      room_size,
      room_capacity,
      price_per_night,
      status,
      room_description
    } = req.body;

    // 🔹 validation
    if (!room_number || !room_size || !price_per_night) {
      return res.status(400).json({
        success: false,
        message: 'room_number, room_size, and price_per_night are required'
      });
    }

    // 🔹 check if room number already exists
    const check = await pool.query(
      `
      SELECT 1
      FROM rooms
      WHERE room_number = $1
      `,
      [room_number]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Room number already exists'
      });
    }

    // 🔥 insert room
    const result = await pool.query(
      `
      INSERT INTO rooms (
        room_number,
        room_size,
        room_capacity,
        price_per_night,
        status,
        room_description
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        room_number,
        room_size,
        room_capacity || 1,
        price_per_night,
        status || 'available',
        room_description || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('CREATE ROOM ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = createRoom;