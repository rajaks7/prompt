// server/routes/sources.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/sources - Fetch all sources
router.get("/", async (req, res) => {
  try {
    const allSources = await pool.query(
      "SELECT id, name FROM sources ORDER BY name ASC"
    );
    res.json(allSources.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/sources - Create a new source
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ msg: "Name is required" });
    }
    const newSource = await pool.query(
      "INSERT INTO sources (name) VALUES($1) RETURNING *",
      [name]
    );
    res.json(newSource.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT /api/sources/:id - Update a source
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedSource = await pool.query(
      "UPDATE sources SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );

    if (updatedSource.rows.length === 0) {
      return res.status(404).json({ msg: "Source not found" });
    }

    res.json(updatedSource.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE /api/sources/:id - Delete a source
router.delete("/:id", async (req, res) => {
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
