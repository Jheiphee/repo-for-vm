const pool = require('../config/db');

const updateProfile = async (req, res) => {

  try {

    // ✅ support both profile_id and id
    const { profile_id, id } = req.params || {};

    const finalId = profile_id || id;

    if (!finalId) {
      return res.status(400).json({
        success: false,
        message: 'profile_id is required'
      });
    }

    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      marital_status,
      contact_number,
      profile_type
    } = req.body || {};

    // 🔹 check if profile exists
    const check = await pool.query(
      `
      SELECT *
      FROM profiles
      WHERE profile_id = $1
      `,
      [finalId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // 🔥 update profile
    const result = await pool.query(
      `
      UPDATE profiles
      SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        date_of_birth = COALESCE($3, date_of_birth),
        gender = COALESCE($4, gender),
        marital_status = COALESCE($5, marital_status),
        contact_number = COALESCE($6, contact_number),
        profile_type = COALESCE($7, profile_type)
      WHERE profile_id = $8
      RETURNING *
      `,
      [
        first_name ?? null,
        last_name ?? null,
        date_of_birth ?? null,
        gender ?? null,
        marital_status ?? null,
        contact_number ?? null,
        profile_type ?? null,
        finalId
      ]
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('UPDATE PROFILE ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = updateProfile;