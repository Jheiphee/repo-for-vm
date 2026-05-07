const pool = require('../config/db');

const getAllEmployment = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        employee_id,
        profile_id,
        job_title,
        position_level,
        status,
        shift
      FROM employment_details
      ORDER BY employee_id ASC
    `);

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error('GET EMPLOYMENT ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getAllEmployment;