const pool = require('../config/db');

const updateEmployment = async (req, res) => {

  try {

    // ✅ employee_id from params
    const { employee_id } = req.params || {};

    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: 'employee_id is required'
      });
    }

    const {
      profile_id,
      hire_date,
      job_title,
      position_level,
      emp_type,
      status,
      shift,
      is_active
    } = req.body;

    // 🔴 check if exists
    const check = await pool.query(
      `
      SELECT 1
      FROM employment_details
      WHERE employee_id = $1
      `,
      [employee_id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employment not found'
      });
    }

    // 🔥 update employment
    const result = await pool.query(
      `
      UPDATE employment_details
      SET 
        profile_id = $1,
        hire_date = $2,
        job_title = $3,
        position_level = $4,
        emp_type = $5,
        status = $6,
        shift = $7,
        is_active = $8
      WHERE employee_id = $9
      RETURNING *
      `,
      [
        profile_id,
        hire_date,
        job_title,
        position_level,
        emp_type,
        status,
        shift,
        is_active,
        employee_id
      ]
    );

    res.status(200).json({
      success: true,
      message: 'Employment updated successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('UPDATE EMPLOYMENT ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = updateEmployment;