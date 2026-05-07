const pool = require('../config/db');

const updateRoom = async (req, res) => {

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

    const {
      room_number,
      room_size,
      room_capacity,
      price_per_night,
      status,
      room_description
    } = req.body || {};

    // 🔹 check room exists
    const check = await pool.query(
      `
      SELECT 1
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

    // 🔹 check duplicate room number
    if (room_number !== undefined) {

      const duplicateCheck = await pool.query(
        `
        SELECT 1
        FROM rooms
        WHERE room_number = $1
        AND room_id != $2
        `,
        [room_number, finalId]
      );

      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Room number already exists'
        });
      }

    }

    let fields = [];
    let values = [];
    let index = 1;

    if (room_number !== undefined) {
      fields.push(`room_number = $${index++}`);
      values.push(room_number);
    }

    if (room_size !== undefined) {
      fields.push(`room_size = $${index++}`);
      values.push(room_size);
    }

    if (room_capacity !== undefined) {
      fields.push(`room_capacity = $${index++}`);
      values.push(room_capacity);
    }

    if (price_per_night !== undefined) {
      fields.push(`price_per_night = $${index++}`);
      values.push(price_per_night);
    }

    if (status !== undefined) {
      fields.push(`status = $${index++}`);
      values.push(status);
    }

    if (room_description !== undefined) {
      fields.push(`room_description = $${index++}`);
      values.push(room_description);
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
      UPDATE rooms
      SET ${fields.join(', ')}
      WHERE room_id = $${index}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('UPDATE ROOM ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = updateRoom;