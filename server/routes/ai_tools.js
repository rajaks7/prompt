const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const allTools = await pool.query("SELECT * FROM ai_tools ORDER BY name ASC");
    res.json(allTools.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, color_hex } = req.body;
    if (!name) {
        return res.status(400).json({ msg: "Name is required" });
    }
    const newTool = await pool.query(
      "INSERT INTO ai_tools (name, color_hex) VALUES($1, $2) RETURNING *",
      [name, color_hex || '#6B7280']
    );
    res.json(newTool.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color_hex } = req.body;
        const updatedTool = await pool.query(
            "UPDATE ai_tools SET name = $1, color_hex = $2 WHERE id = $3 RETURNING *",
            [name, color_hex, id]
        );
        res.json(updatedTool.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

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