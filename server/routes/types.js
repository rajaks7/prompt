// server/routes/types.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const allTypes = await pool.query("SELECT * FROM prompt_types ORDER BY name ASC");
    res.json(allTypes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newType = await pool.query("INSERT INTO prompt_types (name) VALUES($1) RETURNING *", [name]);
    res.json(newType.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM prompt_types WHERE id = $1", [id]);
        res.json({ msg: "Prompt Type deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;