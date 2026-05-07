const pool = require('../config/db');

const createGuest = async (req, res) => {

  try {

    const {
      profile_id,
      guest_type,
      is_member
    } = req.body;

    // 🔹 validation
    if (!profile_id || !guest_type) {
      return res.status(400).json({
        success: false,
        message: 'profile_id and guest_type are required'
      });
    }

    // 🔹 normalize guest_type
    const normalizedType = guest_type.toLowerCase();

    const allowedTypes = [
      'check-in proxy',
      'reservation holder'
    ];

    if (!allowedTypes.includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid guest_type'
      });
    }

    // 🔹 check profile exists
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

    // 🔥 insert guest
    const result = await pool.query(
      `
      INSERT INTO guests (
        profile_id,
        guest_type,
        is_member
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        profile_id,
        normalizedType,
        is_member ?? false
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Guest created successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('CREATE GUEST ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = createGuest;