const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    
    let orderBy = ' ORDER BY p.created_at DESC'; // default
switch(sort) {
  case 'created_at_desc':
    orderBy = ' ORDER BY p.created_at DESC';
    break;
  case 'created_at_asc':
    orderBy = ' ORDER BY p.created_at ASC';
    break;
  case 'title_asc':
    orderBy = ' ORDER BY p.title ASC';
    break;
  case 'title_desc':
    orderBy = ' ORDER BY p.title DESC';
    break;
  case 'rating_desc':
    orderBy = ' ORDER BY p.rating DESC NULLS LAST, p.created_at DESC';
    break;
  case 'rating_asc':
    orderBy = ' ORDER BY p.rating ASC NULLS LAST, p.created_at DESC';
    break;
  default:
    orderBy = ' ORDER BY p.created_at DESC';
}
    
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
// Add this route to increment view count
router.patch('/:id/view', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPrompt = await pool.query(
            "UPDATE prompts SET usage_count = COALESCE(usage_count, 0) + 1 WHERE id = $1 RETURNING id, usage_count",
            [id]
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

// Update a prompt - GENERAL UPDATE
router.patch('/:id', upload.single('attachment'), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, prompt_text, output_text, rating, output_status, 
      tags, credits_used, ai_tool_id, category_id, type_id, 
      source_id, parent_prompt_id, version, ai_tool_model,
      deleteAttachment, replaceAttachment
    } = req.body;

    console.log('Backend received:', req.body);
    console.log('File received:', req.file ? req.file.filename : 'none');

    let attachment_filename = undefined; // Keep undefined to not update if no change

    // Get current attachment info
    const current = await pool.query('SELECT attachment_filename FROM prompts WHERE id = $1', [id]);
    const currentAttachment = current.rows[0]?.attachment_filename;

    // Handle different attachment scenarios
    if (replaceAttachment === 'true' && req.file) {
      // Replace: delete old file and use new file
      if (currentAttachment) {
        const oldFilePath = path.join(__dirname, '../uploads', currentAttachment);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      attachment_filename = req.file.filename;
    } else if (deleteAttachment === 'true' && !req.file) {
      // Just delete: remove old file and set to null
      if (currentAttachment) {
        const oldFilePath = path.join(__dirname, '../uploads', currentAttachment);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      attachment_filename = null;
    } else if (req.file && !currentAttachment) {
      // Add new file to prompt that had no attachment
      attachment_filename = req.file.filename;
    }

    // Parse tags if it's a JSON string (from FormData)
    let parsedTags = tags;
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    // Build dynamic query based on whether attachment is being updated
    let query, queryParams;
    
    if (attachment_filename !== undefined) {
      query = `
        UPDATE prompts SET 
          title = $1, prompt_text = $2, output_text = $3, rating = $4,
          output_status = $5, tags = $6, credits_used = $7, ai_tool_id = $8,
          category_id = $9, type_id = $10, source_id = $11, 
          parent_prompt_id = $12, version = $13, ai_tool_model = $14,
          attachment_filename = $15, updated_at = CURRENT_TIMESTAMP
        WHERE id = $16
        RETURNING *
      `;
      queryParams = [
        title, prompt_text, output_text, rating, 
        output_status, parsedTags, credits_used, ai_tool_id,
        category_id, type_id, source_id, parent_prompt_id,
        version, ai_tool_model, attachment_filename, id
      ];
    } else {
      query = `
        UPDATE prompts SET 
          title = $1, prompt_text = $2, output_text = $3, rating = $4,
          output_status = $5, tags = $6, credits_used = $7, ai_tool_id = $8,
          category_id = $9, type_id = $10, source_id = $11, 
          parent_prompt_id = $12, version = $13, ai_tool_model = $14,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $15
        RETURNING *
      `;
      queryParams = [
        title, prompt_text, output_text, rating, 
        output_status, parsedTags, credits_used, ai_tool_id,
        category_id, type_id, source_id, parent_prompt_id,
        version, ai_tool_model, id
      ];
    }
    
    const result = await pool.query(query, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating prompt:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;