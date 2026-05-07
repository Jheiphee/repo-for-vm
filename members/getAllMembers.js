const pool = require('../config/db');

const getAllMembers = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        g.guest_id,
        p.profile_id,
        p.first_name,
        p.last_name,
        p.profile_type AS role
      FROM guests g
      JOIN profiles p
        ON g.profile_id = p.profile_id
      WHERE g.is_member = true
      ORDER BY p.last_name ASC
    `);

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error('GET MEMBERS ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getAllMembers;