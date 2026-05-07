const pool = require('../config/db');

const updateGuest = async (req, res) => {

  try {

    // ✅ support both guest_id and id
    const { guest_id, id } = req.params || {};

    const finalId = guest_id || id;

    if (!finalId) {
      return res.status(400).json({
        success: false,
        message: 'guest_id is required in path'
      });
    }

    let {
      profile_id,
      guest_type,
      is_member
    } = req.body || {};

    // 🔹 convert string to boolean
    if (typeof is_member === 'string') {
      is_member = is_member.toLowerCase() === 'true';
    }

    // 🔹 check guest exists
    const check = await pool.query(
      `
      SELECT 1
      FROM guests
      WHERE guest_id = $1
      `,
      [finalId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    // 🔹 check profile exists
    if (profile_id !== undefined && profile_id !== null) {

      const profileCheck = await pool.query(
        `
        SELECT 1
        FROM profiles
        WHERE profile_id = $1
        `,
        [profile_id]
      );

      if (profileCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Profile does not exist'
        });
      }

    }

    let fields = [];
    let values = [];
    let index = 1;

    if (profile_id !== undefined) {
      fields.push(`profile_id = $${index++}`);
      values.push(profile_id);
    }

    if (guest_type !== undefined) {
      fields.push(`guest_type = $${index++}`);
      values.push(guest_type);
    }

    if (is_member !== undefined) {
      fields.push(`is_member = $${index++}`);
      values.push(is_member);
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
      UPDATE guests
      SET ${fields.join(', ')}
      WHERE guest_id = $${index}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      message: 'Guest updated successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('UPDATE GUEST ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = updateGuest;