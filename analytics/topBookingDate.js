const pool = require('../config/db');

const getTopBookingDate = async (req, res) => {

  try {

    const result = await pool.query(`
      WITH expanded_dates AS (
        SELECT 
          generate_series(
            check_in_date,
            COALESCE(check_out_date - interval '1 day', check_in_date),
            interval '1 day'
          )::date AS date
        FROM bookings
      ),
      daily_counts AS (
        SELECT 
          date,
          COUNT(*) AS total_bookings
        FROM expanded_dates
        GROUP BY date
      ),
      max_count AS (
        SELECT MAX(total_bookings) AS max_total
        FROM daily_counts
      )
      SELECT *
      FROM daily_counts
      WHERE total_bookings = (SELECT max_total FROM max_count)
      ORDER BY date;
    `);

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error('TOP BOOKING DATE ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = getTopBookingDate;