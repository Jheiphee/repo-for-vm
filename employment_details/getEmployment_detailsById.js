const pool = require('../config/db');

const getEmploymentById = async (req, res) => {

  try {

    // ✅ support employee_id
    const { employee_id } = req.params || {};

    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: 'employee_id is required'
      });
    }

    const result = await pool.query(
      `
      SELECT 
        employee_id,
        profile_id,
        hire_date,
        job_title,
        position_level,
        emp_type,
        status,
        shift,
        is_active
      FROM employment_details
      WHERE employee_id = $1
      `,
      [employee_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {

    console.error('GET EMPLOYMENT BY ID ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getEmploymentById;