const pool = require('../config/db');

const getTopRevenueDate = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        payment_date::date AS date,
        SUM(payment_amount) AS total_revenue
      FROM payments
      GROUP BY payment_date::date
      ORDER BY total_revenue DESC
      LIMIT 1
    `);

    res.status(200).json({
      success: true,
      data: result.rows[0] || null
    });

  } catch (err) {

    console.error('TOP REVENUE DATE ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getTopRevenueDate;