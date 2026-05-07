const pool = require('../config/db');

const createMember = async (req, res) => {

  try {

    const {
      guest_id,
      guest_type
    } = req.body;

    // ✅ validation
    if (!guest_id) {
      return res.status(400).json({
        success: false,
        message: 'guest_id is required'
      });
    }

    // 🔹 check guest exists
    const guestCheck = await pool.query(
      `
      SELECT *
      FROM guests
      WHERE guest_id = $1
      `,
      [guest_id]
    );

    if (guestCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    // 🔹 already member?
    if (guestCheck.rows[0].is_member === true) {
      return res.status(400).json({
        success: false,
        message: 'Guest is already a member'
      });
    }

    // 🔥 convert guest to member
    const result = await pool.query(
      `
      UPDATE guests
      SET
        is_member = true,
        guest_type = COALESCE($1, guest_type)
      WHERE guest_id = $2
      RETURNING *
      `,
      [
        guest_type ?? null,
        guest_id
      ]
    );

    res.status(200).json({
      success: true,
      message: 'Member created successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('CREATE MEMBER ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = createMember;