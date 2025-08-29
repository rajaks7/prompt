const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/ai_tools - Fetch all AI tools
router.get('/', async (req, res) => {
  try {
    const allTools = await pool.query("SELECT * FROM ai_tools ORDER BY name ASC");
    res.json(allTools.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/ai_tools - Create a new AI tool
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

// PUT /api/ai_tools/:id - Update an AI tool
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color_hex } = req.body;
        
        if (!name) {
            return res.status(400).json({ msg: "Name is required" });
        }
        
        const updatedTool = await pool.query(
            "UPDATE ai_tools SET name = $1, color_hex = $2 WHERE id = $3 RETURNING *",
            [name, color_hex || '#6B7280', id]
        );
        
        if (updatedTool.rows.length === 0) {
            return res.status(404).json({ msg: "AI Tool not found" });
        }
        
        res.json(updatedTool.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// DELETE /api/ai_tools/:id - Delete an AI tool (with proper constraint handling)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // First, check if any prompts are using this AI tool
        const promptsUsingTool = await pool.query(
            "SELECT COUNT(*) FROM prompts WHERE ai_tool_id = $1", 
            [id]
        );
        
        const promptCount = parseInt(promptsUsingTool.rows[0].count);
        
        if (promptCount > 0) {
            return res.status(400).json({ 
                msg: `Cannot delete this AI tool because it is being used by ${promptCount} prompt${promptCount > 1 ? 's' : ''}. Please reassign or delete those prompts first.`,
                promptCount: promptCount
            });
        }
        
        // If no prompts are using this tool, safe to delete
        const deletedTool = await pool.query(
            "DELETE FROM ai_tools WHERE id = $1 RETURNING *", 
            [id]
        );
        
        if (deletedTool.rows.length === 0) {
            return res.status(404).json({ msg: "AI Tool not found" });
        }
        
        res.json({ 
            msg: "AI Tool deleted successfully", 
            deletedTool: deletedTool.rows[0] 
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// GET /api/ai_tools/:id/usage - Get usage statistics for a specific AI tool
router.get('/:id/usage', async (req, res) => {
    try {
        const { id } = req.params;
        
        const usage = await pool.query(`
            SELECT 
                COUNT(*) as prompt_count,
                AVG(rating) as avg_rating,
                SUM(usage_count) as total_usage
            FROM prompts 
            WHERE ai_tool_id = $1
        `, [id]);
        
        res.json(usage.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;