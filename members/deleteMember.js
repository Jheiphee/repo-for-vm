const pool = require('../config/db');

const deleteMember = async (req, res) => {

  try {

    const { guest_id, id } = req.params || {};

    const finalId = guest_id || id;

    if (!finalId) {
      return res.status(400).json({
        success: false,
        message: 'guest_id is required'
      });
    }

    // 🔹 check if member exists
    const check = await pool.query(
      `
      SELECT *
      FROM guests
      WHERE guest_id = $1
      AND is_member = true
      `,
      [finalId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // 🔥 remove membership only
    const result = await pool.query(
      `
      UPDATE guests
      SET is_member = false
      WHERE guest_id = $1
      RETURNING *
      `,
      [finalId]
    );

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('DELETE MEMBER ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = deleteMember;