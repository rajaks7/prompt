// server/routes/tools.js

const express = require('express');
const router = express.Router();
const pool = require('../db'); // Our database connection

// --- API Endpoints for AI Tools ---

// GET /api/tools - Fetch all AI tools
router.get('/', async (req, res) => {
  try {
    const allTools = await pool.query("SELECT * FROM ai_tools ORDER BY name ASC");
    res.json(allTools.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/tools - Create a new AI tool
router.post('/', async (req, res) => {
  try {
    const { name } = req.body; // Get the name from the request body
    if (!name) {
        return res.status(400).json({ msg: "Name is required" });
    }
    const newTool = await pool.query(
      "INSERT INTO ai_tools (name) VALUES($1) RETURNING *",
      [name]
    );
    res.json(newTool.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE /api/tools/:id - Delete an AI tool
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM ai_tools WHERE id = $1", [id]);
        res.json({ msg: "AI Tool deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;