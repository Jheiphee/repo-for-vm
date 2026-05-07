const pool = require('../config/db');

const getAllRooms = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM rooms
      ORDER BY room_id ASC
    `);

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error('GET ROOMS ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getAllRooms;