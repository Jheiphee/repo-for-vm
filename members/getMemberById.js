const pool = require('../config/db');

const getMemberById = async (req, res) => {

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
        g.guest_id,
        p.profile_id,
        p.first_name,
        p.last_name,
        p.profile_type AS role,
        g.guest_type,
        g.is_member
      FROM guests g
      JOIN profiles p
        ON g.profile_id = p.profile_id
      WHERE g.guest_id = $1
      AND g.is_member = true
      `,
      [finalId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {

    console.error('GET MEMBER BY ID ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getMemberById;