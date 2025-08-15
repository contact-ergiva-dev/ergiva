const express = require('express');
const { query } = require('../config/database');
const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM categories WHERE is_active = TRUE ORDER BY name');
    res.json({ 
      success: true,
      categories: result.rows 
    });
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server Error',
      error: err.message 
    });
  }
});

// Get category by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM categories WHERE id = $1 AND is_active = TRUE', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }
    
    res.json({ 
      success: true,
      category: result.rows[0] 
    });
  } catch (err) {
    console.error('Error fetching category:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server Error',
      error: err.message 
    });
  }
});

module.exports = router;