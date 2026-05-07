const pool = require('../config/db');

const deleteEmployment = async (req, res) => {

  try {

    // ✅ employee_id from params
    const { employee_id } = req.params || {};

    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: 'employee_id is required'
      });
    }

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

    // 🔥 delete employment
    const result = await pool.query(
      `
      DELETE FROM employment_details
      WHERE employee_id = $1
      RETURNING *
      `,
      [employee_id]
    );

    res.status(200).json({
      success: true,
      message: 'Employment deleted successfully',
      data: result.rows[0]
    });

  } catch (err) {

    console.error('DELETE EMPLOYMENT ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = deleteEmployment;