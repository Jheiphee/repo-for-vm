const pool = require('../config/db');

const updateMember = async (req, res) => {

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

    const {
      guest_type,
      is_member
    } = req.body || {};

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

    let fields = [];
    let values = [];
    let index = 1;

    // 🔹 update guest_type
    if (guest_type !== undefined) {
      fields.push(`guest_type = $${index++}`);
      values.push(guest_type);
    }

    // 🔹 optional membership update
    if (is_member !== undefined) {
      fields.push(`is_member = $${index++}`);
      values.push(is_member);
    }

    // 🔹 no fields
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
      message: 'Member updated successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('UPDATE MEMBER ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = updateMember;