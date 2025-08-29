// server/routes/sources.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const allSources = await pool.query("SELECT * FROM sources ORDER BY name ASC");
    res.json(allSources.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newSource = await pool.query("INSERT INTO sources (name) VALUES($1) RETURNING *", [name]);
    res.json(newSource.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM sources WHERE id = $1", [id]);
        res.json({ msg: "Source deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;