const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    let queryParams = [];
    let whereClauses = [];
    const { search, tool, category, rating, sort, favoritesOnly } = req.query;

    let baseQuery = `
      SELECT
        p.id, p.title, p.prompt_text, p.rating, p.created_at, p.attachment_filename, 
        p.tags, p.usage_count, p.is_favorite,
        t.name AS tool_name, t.color_hex AS tool_color, 
        c.name AS category_name, c.image_url AS category_image_url
      FROM prompts p
      LEFT JOIN ai_tools t ON p.ai_tool_id = t.id
      LEFT JOIN categories c ON p.category_id = c.id
    `;

    if (favoritesOnly === 'true') {
        whereClauses.push('p.is_favorite = true');
    }
    if (search) {
      queryParams.push(`%${search}%`);
      whereClauses.push(`(p.title ILIKE $${queryParams.length} OR p.prompt_text ILIKE $${queryParams.length})`);
    }
    if (tool) {
      queryParams.push(tool);
      whereClauses.push(`p.ai_tool_id = $${queryParams.length}`);
    }
    if (category) {
      queryParams.push(category);
      whereClauses.push(`p.category_id = $${queryParams.length}`);
    }
    if (rating) {
      queryParams.push(rating);
      whereClauses.push(`p.rating >= $${queryParams.length}`);
    }

    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    
    let orderBy = ' ORDER BY p.created_at DESC';
    if(sort === 'rating_desc') orderBy = ' ORDER BY p.rating DESC NULLS LAST, p.created_at DESC';
    if(sort === 'title_asc') orderBy = ' ORDER BY p.title ASC';
    
    baseQuery += orderBy;

    const allPrompts = await pool.query(baseQuery, queryParams);
    res.json(allPrompts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT
                p.*,
                t.name AS tool_name, t.color_hex AS tool_color,
                c.name AS category_name,
                pt.name AS type_name,
                s.name AS source_name,
                parent.title as parent_prompt_title
            FROM prompts p
            LEFT JOIN ai_tools t ON p.ai_tool_id = t.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN prompt_types pt ON p.type_id = pt.id
            LEFT JOIN sources s ON p.source_id = s.id
            LEFT JOIN prompts parent ON p.parent_prompt_id = parent.id
            WHERE p.id = $1;
        `;
        const promptResult = await pool.query(query, [id]);
        if (promptResult.rows.length === 0) {
            return res.status(404).json({ msg: "Prompt not found" });
        }
        res.json(promptResult.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const {
      title, prompt_text, output_text, type_id, source_id, ai_tool_id,
      category_id, rating, output_status, tags, credits_used, parent_prompt_id
    } = req.body;
    const attachment_filename = req.file ? req.file.filename : null;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const newPrompt = await pool.query(
      `INSERT INTO prompts (
        title, prompt_text, output_text, type_id, source_id, ai_tool_id, category_id, 
        rating, output_status, tags, credits_used, attachment_filename, is_favorite, parent_prompt_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        title, prompt_text, output_text, type_id, source_id || null, ai_tool_id, category_id,
        rating, output_status, tagsArray, credits_used || null, attachment_filename, false, parent_prompt_id || null
      ]
    );
    res.status(201).json(newPrompt.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.patch('/:id/favorite', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_favorite } = req.body;
        const updatedPrompt = await pool.query(
            "UPDATE prompts SET is_favorite = $1 WHERE id = $2 RETURNING id, is_favorite",
            [is_favorite, id]
        );
        if (updatedPrompt.rows.length === 0) {
            return res.status(404).json({ msg: "Prompt not found" });
        }
        res.json(updatedPrompt.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;