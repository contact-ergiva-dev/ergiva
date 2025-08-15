const express = require('express');
const { query } = require('../config/database');
const { optionalAuth, authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all products (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, limit = 20, offset = 0, search } = req.query;
    
    let queryText = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = TRUE
    `;
    const queryParams = [];
    let paramIndex = 1;

    // Add category filter
    if (category) {
      queryText += ` AND c.name ILIKE $${paramIndex}`;
      queryParams.push(`%${category}%`);
      paramIndex++;
    }

    // Add search filter
    if (search) {
      queryText += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex + 1})`;
      queryParams.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    queryText += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await query(queryText, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = TRUE
    `;
    const countParams = [];
    let countParamIndex = 1;

    if (category) {
      countQuery += ` AND c.name ILIKE $${countParamIndex}`;
      countParams.push(`%${category}%`);
      countParamIndex++;
    }

    if (search) {
      countQuery += ` AND (p.name ILIKE $${countParamIndex} OR p.description ILIKE $${countParamIndex + 1})`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const countResult = await query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      products: result.rows,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < totalCount
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get featured products (public)
router.get('/featured', async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = TRUE 
      ORDER BY p.created_at DESC 
      LIMIT 6
    `);

    res.json({ products: result.rows });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// Get single product (public)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1 AND p.is_active = TRUE
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get all categories (public)
router.get('/categories/all', async (req, res) => {
  try {
    const result = await query(`
      SELECT c.*, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
      GROUP BY c.id 
      ORDER BY c.name
    `);

    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Admin Routes

// Create product (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category_id,
      image_urls,
      stock_quantity,
      features,
      specifications
    } = req.body;

    const result = await query(`
      INSERT INTO products 
      (name, description, price, category_id, image_urls, stock_quantity, features, specifications)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `, [
      name,
      description,
      price,
      category_id,
      image_urls || [],
      stock_quantity || 0,
      features || [],
      specifications || {}
    ]);

    res.status(201).json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category_id,
      image_urls,
      stock_quantity,
      features,
      specifications,
      is_active
    } = req.body;

    const result = await query(`
      UPDATE products 
      SET name = $1, description = $2, price = $3, category_id = $4, 
          image_urls = $5, stock_quantity = $6, features = $7, 
          specifications = $8, is_active = $9
      WHERE id = $10 
      RETURNING *
    `, [
      name,
      description,
      price,
      category_id,
      image_urls,
      stock_quantity,
      features,
      specifications,
      is_active,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Create category (admin only)
router.post('/categories', authenticateAdmin, async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    const result = await query(
      'INSERT INTO categories (name, description, image_url) VALUES ($1, $2, $3) RETURNING *',
      [name, description, image_url]
    );

    res.status(201).json({
      success: true,
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

module.exports = router;