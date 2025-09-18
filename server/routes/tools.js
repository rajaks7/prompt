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
    const { name, color_hex } = req.body;
    if (!name) {
      return res.status(400).json({ msg: "Name is required" });
    }
    const newTool = await pool.query(
      "INSERT INTO ai_tools (name, color_hex) VALUES($1, $2) RETURNING *",
      [name, color_hex || '#3B82F6']
    );
    res.json(newTool.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT /api/tools/:id - Update AI tool
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color_hex } = req.body;

    const updatedTool = await pool.query(
      "UPDATE ai_tools SET name = $1, color_hex = $2 WHERE id = $3 RETURNING *",
      [name, color_hex || '#3B82F6', id]
    );

    if (updatedTool.rows.length === 0) {
      return res.status(404).json({ msg: "Tool not found" });
    }

    res.json(updatedTool.rows[0]);
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
