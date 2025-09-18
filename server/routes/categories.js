const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- Multer setup for image uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ✅ match prompts.js
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "category-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// --- Routes ---

// GET /api/categories
router.get("/", async (req, res) => {
  try {
    const allCategories = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );
    res.json(allCategories.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/categories
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, color_hex } = req.body;
    if (!name) {
      return res.status(400).json({ msg: "Name is required" });
    }

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const newCategory = await pool.query(
      "INSERT INTO categories (name, color_hex, image_url) VALUES ($1, $2, $3) RETURNING *",
      [name, color_hex || "#3B82F6", image_url]
    );

    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT /api/categories/:id
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color_hex } = req.body;

    // Fetch current category
    const current = await pool.query("SELECT image_url FROM categories WHERE id = $1", [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ msg: "Category not found" });
    }

    let image_url = null;
    if (req.file) {
      // Delete old file if exists
      if (current.rows[0].image_url) {
        const oldPath = path.join(__dirname, "..", current.rows[0].image_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    const updatedCategory = await pool.query(
      `UPDATE categories 
       SET name = $1, color_hex = $2, image_url = COALESCE($3, image_url) 
       WHERE id = $4 RETURNING *`,
      [name, color_hex || "#3B82F6", image_url, id]
    );

    res.json(updatedCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE /api/categories/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch category first
    const category = await pool.query("SELECT image_url FROM categories WHERE id = $1", [id]);
    if (category.rows.length === 0) {
      return res.status(404).json({ msg: "Category not found" });
    }

    const image_url = category.rows[0].image_url;

    // Delete from DB
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);

    // Delete file if exists
    if (image_url) {
      const filePath = path.join(__dirname, "..", image_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted image file: ${filePath}`);
      }
    }

    res.json({ msg: "Category and image deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
