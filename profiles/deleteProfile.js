const pool = require('../config/db');

const deleteProfile = async (req, res) => {

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

    // 🔥 delete profile
    await pool.query(
      `
      DELETE FROM profiles
      WHERE profile_id = $1
      `,
      [finalId]
    );

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });

  } catch (err) {

    console.error('DELETE PROFILE ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = deleteProfile;