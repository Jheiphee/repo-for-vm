const pool = require('../config/db');

const getGuestById = async (req, res) => {

  try {

    // ✅ support both guest_id and id
    const { guest_id, id } = req.params || {};

    const finalId = guest_id || id;

    if (!finalId) {
      return res.status(400).json({
        success: false,
        message: 'guest_id is required'
      });
    }

    const result = await pool.query(
      `
      SELECT 
        guest_id,
        profile_id,
        guest_type,
        is_member
      FROM guests
      WHERE guest_id = $1
      `,
      [finalId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {

    console.error('GET GUEST BY ID ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getGuestById;