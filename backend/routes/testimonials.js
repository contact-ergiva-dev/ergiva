const express = require('express');
const { query } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all testimonials (public)
router.get('/', async (req, res) => {
  try {
    const { featured_only = false, limit = 10, offset = 0 } = req.query;
    
    let queryText = 'SELECT * FROM testimonials WHERE is_active = TRUE';
    const queryParams = [];
    let paramIndex = 1;

    if (featured_only === 'true') {
      queryText += ` AND is_featured = TRUE`;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await query(queryText, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM testimonials WHERE is_active = TRUE';
    if (featured_only === 'true') {
      countQuery += ' AND is_featured = TRUE';
    }

    const countResult = await query(countQuery);

    res.json({
      testimonials: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Get featured testimonials for homepage (public)
router.get('/featured', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM testimonials 
      WHERE is_active = TRUE AND is_featured = TRUE
      ORDER BY created_at DESC 
      LIMIT 6
    `);

    res.json({ testimonials: result.rows });
  } catch (error) {
    console.error('Get featured testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch featured testimonials' });
  }
});

// Get single testimonial (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM testimonials WHERE id = $1 AND is_active = TRUE',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ testimonial: result.rows[0] });
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
});

// Admin Routes

// Get all testimonials for admin (admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { 
      limit = 20, 
      offset = 0, 
      is_active, 
      is_featured,
      search 
    } = req.query;

    let queryText = 'SELECT * FROM testimonials WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    if (is_active !== undefined) {
      queryText += ` AND is_active = $${paramIndex}`;
      queryParams.push(is_active === 'true');
      paramIndex++;
    }

    if (is_featured !== undefined) {
      queryText += ` AND is_featured = $${paramIndex}`;
      queryParams.push(is_featured === 'true');
      paramIndex++;
    }

    if (search) {
      queryText += ` AND (name ILIKE $${paramIndex} OR content ILIKE $${paramIndex + 1})`;
      queryParams.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await query(queryText, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM testimonials WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;

    if (is_active !== undefined) {
      countQuery += ` AND is_active = $${countParamIndex}`;
      countParams.push(is_active === 'true');
      countParamIndex++;
    }

    if (is_featured !== undefined) {
      countQuery += ` AND is_featured = $${countParamIndex}`;
      countParams.push(is_featured === 'true');
      countParamIndex++;
    }

    if (search) {
      countQuery += ` AND (name ILIKE $${countParamIndex} OR content ILIKE $${countParamIndex + 1})`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const countResult = await query(countQuery, countParams);

    res.json({
      testimonials: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Admin get testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Create testimonial (admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      content,
      rating,
      image_url,
      video_url,
      is_featured = false
    } = req.body;

    // Validate required fields
    if (!name || !content || !rating) {
      return res.status(400).json({ 
        error: 'Name, content, and rating are required' 
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: 'Rating must be between 1 and 5' 
      });
    }

    const result = await query(`
      INSERT INTO testimonials 
      (name, content, rating, image_url, video_url, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `, [name, content, rating, image_url, video_url, is_featured]);

    res.status(201).json({
      success: true,
      testimonial: result.rows[0]
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// Update testimonial (admin)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      content,
      rating,
      image_url,
      video_url,
      is_featured,
      is_active
    } = req.body;

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        error: 'Rating must be between 1 and 5' 
      });
    }

    const result = await query(`
      UPDATE testimonials 
      SET name = COALESCE($1, name),
          content = COALESCE($2, content),
          rating = COALESCE($3, rating),
          image_url = COALESCE($4, image_url),
          video_url = COALESCE($5, video_url),
          is_featured = COALESCE($6, is_featured),
          is_active = COALESCE($7, is_active)
      WHERE id = $8 
      RETURNING *
    `, [name, content, rating, image_url, video_url, is_featured, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({
      success: true,
      testimonial: result.rows[0]
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

// Delete testimonial (admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM testimonials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// Toggle featured status (admin)
router.patch('/:id/featured', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_featured } = req.body;

    const result = await query(
      'UPDATE testimonials SET is_featured = $1 WHERE id = $2 RETURNING *',
      [is_featured, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({
      success: true,
      testimonial: result.rows[0]
    });
  } catch (error) {
    console.error('Toggle featured testimonial error:', error);
    res.status(500).json({ error: 'Failed to update testimonial featured status' });
  }
});

// Toggle active status (admin)
router.patch('/:id/active', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const result = await query(
      'UPDATE testimonials SET is_active = $1 WHERE id = $2 RETURNING *',
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({
      success: true,
      testimonial: result.rows[0]
    });
  } catch (error) {
    console.error('Toggle active testimonial error:', error);
    res.status(500).json({ error: 'Failed to update testimonial active status' });
  }
});

// Get testimonial statistics (admin)
router.get('/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_testimonials,
        COUNT(*) FILTER (WHERE is_active = TRUE) as active_testimonials,
        COUNT(*) FILTER (WHERE is_featured = TRUE) as featured_testimonials,
        ROUND(AVG(rating), 1) as average_rating,
        COUNT(*) FILTER (WHERE rating = 5) as five_star_count,
        COUNT(*) FILTER (WHERE rating = 4) as four_star_count,
        COUNT(*) FILTER (WHERE rating = 3) as three_star_count,
        COUNT(*) FILTER (WHERE rating = 2) as two_star_count,
        COUNT(*) FILTER (WHERE rating = 1) as one_star_count,
        COUNT(*) FILTER (WHERE video_url IS NOT NULL) as video_testimonials,
        COUNT(*) FILTER (WHERE image_url IS NOT NULL) as image_testimonials
      FROM testimonials
    `);

    res.json({ stats: stats.rows[0] });
  } catch (error) {
    console.error('Get testimonial stats error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial statistics' });
  }
});

// Bulk update testimonials (admin)
router.put('/admin/bulk-update', authenticateAdmin, async (req, res) => {
  try {
    const { testimonial_ids, is_featured, is_active } = req.body;

    if (!testimonial_ids || !Array.isArray(testimonial_ids) || testimonial_ids.length === 0) {
      return res.status(400).json({ error: 'Testimonial IDs array is required' });
    }

    let updateFields = [];
    let updateValues = [...testimonial_ids];
    let paramIndex = testimonial_ids.length + 1;

    if (is_featured !== undefined) {
      updateFields.push(`is_featured = $${paramIndex}`);
      updateValues.push(is_featured);
      paramIndex++;
    }

    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramIndex}`);
      updateValues.push(is_active);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'At least one field to update is required' });
    }

    // Create placeholders for the IN clause
    const placeholders = testimonial_ids.map((_, index) => `$${index + 1}`).join(',');
    
    const result = await query(`
      UPDATE testimonials 
      SET ${updateFields.join(', ')}
      WHERE id IN (${placeholders})
      RETURNING *
    `, updateValues);

    res.json({
      success: true,
      updated_count: result.rows.length,
      testimonials: result.rows
    });
  } catch (error) {
    console.error('Bulk update testimonials error:', error);
    res.status(500).json({ error: 'Failed to bulk update testimonials' });
  }
});

module.exports = router;