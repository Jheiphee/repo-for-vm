const pool = require('../config/db');

const createEmployment = async (req, res) => {

  try {

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

    // ✅ validation
    if (!profile_id || !job_title || !hire_date || !emp_type) {
      return res.status(400).json({
        success: false,
        message: 'profile_id, hire_date, job_title, emp_type are required'
      });
    }

    // ✅ check profile exists
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

    // 🔥 generate employee_id
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const employee_id = `EMP${randomNum}`;

    // 🔥 insert employment
    const result = await pool.query(
      `
      INSERT INTO employment_details (
        employee_id,
        profile_id,
        hire_date,
        job_title,
        position_level,
        emp_type,
        status,
        shift,
        is_active
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `,
      [
        employee_id,
        profile_id,
        hire_date,
        job_title,
        position_level,
        emp_type,
        status,
        shift,
        is_active ?? true
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Employment created successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('CREATE EMPLOYMENT ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = createEmployment;