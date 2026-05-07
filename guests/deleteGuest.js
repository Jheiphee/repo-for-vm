const pool = require('../config/db');

const deleteGuest = async (req, res) => {

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

    // 🔹 check guest exists
    const guestCheck = await pool.query(
      `
      SELECT 1
      FROM guests
      WHERE guest_id = $1
      `,
      [finalId]
    );

    if (guestCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    // 🔥 delete guest
    await pool.query(
      `
      DELETE FROM guests
      WHERE guest_id = $1
      `,
      [finalId]
    );

    res.status(200).json({
      success: true,
      message: 'Guest deleted successfully'
    });

  } catch (err) {

    console.error('DELETE GUEST ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = deleteGuest;