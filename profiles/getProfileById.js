const pool = require('../config/db');

const getProfileById = async (req, res) => {

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

    const result = await pool.query(
      `
      SELECT *
      FROM profiles
      WHERE profile_id = $1
      `,
      [finalId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {

    console.error('GET PROFILE BY ID ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getProfileById;