const express = require('express');
const router = express.Router(); // <-- THIS LINE WAS MISSING
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const allCategories = await pool.query("SELECT * FROM categories ORDER BY name ASC");
    res.json(allCategories.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, image_url } = req.body;
    if (!name) {
        return res.status(400).json({ msg: "Name is required" });
    }
    const newCategory = await pool.query(
      "INSERT INTO categories (name, image_url) VALUES($1, $2) RETURNING *",
      [name, image_url]
    );
    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM categories WHERE id = $1", [id]);
        res.json({ msg: "Category deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;