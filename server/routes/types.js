const express = require("express");
const router = express.Router();
const pool = require("../db");

// --- API Endpoints for Prompt Types ---

// GET /api/types - Fetch all types
router.get("/", async (req, res) => {
  try {
    const allTypes = await pool.query("SELECT id, name FROM prompt_types ORDER BY name ASC");
    res.json(allTypes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/types - Create a new type
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ msg: "Name is required" });
    }
    const newType = await pool.query(
  "INSERT INTO prompt_types (name) VALUES($1) RETURNING *",
  [name]
);
    res.json(newType.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT /api/types/:id - Update a type
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedType = await pool.query(
  "UPDATE prompt_types SET name = $1 WHERE id = $2 RETURNING *",
  [name, id]
);

    if (updatedType.rows.length === 0) {
      return res.status(404).json({ msg: "Type not found" });
    }

    res.json(updatedType.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE /api/types/:id - Delete a type
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM prompt_types WHERE id = $1", [id]);
    res.json({ msg: "Type deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
