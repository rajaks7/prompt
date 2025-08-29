// server/routes/stats.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    // We can run multiple queries at once for efficiency
    const statsQueries = [
      pool.query('SELECT COUNT(*) FROM prompts'), // Total Prompts
      pool.query('SELECT AVG(rating) FROM prompts WHERE rating IS NOT NULL'), // Average Rating
      pool.query(`
        SELECT t.name, COUNT(p.id) as count
        FROM prompts p
        JOIN ai_tools t ON p.ai_tool_id = t.id
        GROUP BY t.name
        ORDER BY count DESC
        LIMIT 5
      `), // Tool Distribution
      pool.query(`
        SELECT c.name, COUNT(p.id) as count
        FROM prompts p
        JOIN categories c ON p.category_id = c.id
        GROUP BY c.name
        ORDER BY count DESC
        LIMIT 5
      `), // Category Distribution
    ];

    const [
      totalPromptsRes,
      avgRatingRes,
      toolDistributionRes,
      categoryDistributionRes
    ] = await Promise.all(statsQueries);

    const stats = {
      totalPrompts: parseInt(totalPromptsRes.rows[0].count, 10),
      avgRating: parseFloat(avgRatingRes.rows[0].avg).toFixed(1),
      toolDistribution: toolDistributionRes.rows,
      categoryDistribution: categoryDistributionRes.rows,
    };

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;