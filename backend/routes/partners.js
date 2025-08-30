const express = require('express');
const { query } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');
const { sendPartnerApplicationConfirmation } = require('../services/emailService');
const router = express.Router();

// Submit partner application (public)
router.post('/apply', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      qualification,
      years_experience,
      preferred_area,
      additional_info
    } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !qualification || !years_experience) {
      return res.status(400).json({ 
        error: 'Name, phone, email, qualification, and years of experience are required' 
      });
    }

    // Check if application already exists with same email
    const existingApplication = await query(
      'SELECT id FROM partner_applications WHERE email = $1',
      [email]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ 
        error: 'An application with this email already exists' 
      });
    }

    // Create partner application
    const result = await query(`
      INSERT INTO partner_applications 
      (name, mobile, email, qualification, years_experience, preferred_area, additional_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `, [name, phone, email, qualification, years_experience, preferred_area, additional_info]);

    const application = result.rows[0];

    // Send confirmation emails
    try {
      // Send confirmation to applicant
      await sendPartnerApplicationConfirmation(email, {
        name,
        application_id: application.id,
        qualification,
        years_experience,
        preferred_area
      });

      // Send notification to admin
      await sendPartnerApplicationConfirmation('admin@ergiva.com', {
        name,
        phone,
        email,
        qualification,
        years_experience,
        preferred_area,
        additional_info,
        application_id: application.id
      }, true); // isAdmin = true
    } catch (emailError) {
      console.error('Partner application email error:', emailError);
      // Don't fail the application if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application_id: application.id
    });
  } catch (error) {
    console.error('Partner application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get application status (public - requires application ID and email)
router.get('/application/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await query(
      'SELECT id, status, created_at, review_notes FROM partner_applications WHERE id = $1 AND email = $2',
      [id, email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ application: result.rows[0] });
  } catch (error) {
    console.error('Get application status error:', error);
    res.status(500).json({ error: 'Failed to fetch application status' });
  }
});

// Admin Routes

// Get all partner applications (admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { 
      limit = 20, 
      offset = 0, 
      status, 
      search 
    } = req.query;

    let queryText = `
      SELECT pa.*, u.name as reviewed_by_name 
      FROM partner_applications pa
      LEFT JOIN users u ON pa.reviewed_by = u.id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramIndex = 1;

    if (status) {
      queryText += ` AND pa.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (search) {
      queryText += ` AND (pa.name ILIKE $${paramIndex} OR pa.email ILIKE $${paramIndex + 1} OR pa.mobile ILIKE $${paramIndex + 2})`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      paramIndex += 3;
    }

    queryText += ` ORDER BY pa.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await query(queryText, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM partner_applications pa WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;

    if (status) {
      countQuery += ` AND pa.status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }

    if (search) {
      countQuery += ` AND (pa.name ILIKE $${countParamIndex} OR pa.email ILIKE $${countParamIndex + 1} OR pa.mobile ILIKE $${countParamIndex + 2})`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const countResult = await query(countQuery, countParams);

    res.json({
      applications: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Admin get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get single application details (admin)
router.get('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT pa.*, u.name as reviewed_by_name 
      FROM partner_applications pa
      LEFT JOIN users u ON pa.reviewed_by = u.id
      WHERE pa.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ application: result.rows[0] });
  } catch (error) {
    console.error('Get application details error:', error);
    res.status(500).json({ error: 'Failed to fetch application details' });
  }
});

// Update application status (admin)
router.put('/admin/:id/review', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body;
    const reviewedBy = req.user.id;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: pending, approved, rejected' 
      });
    }

    const result = await query(`
      UPDATE partner_applications 
      SET status = $1, review_notes = $2, reviewed_by = $3
      WHERE id = $4 
      RETURNING *
    `, [status, review_notes, reviewedBy, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = result.rows[0];

    // Send status update email to applicant
    try {
      await sendPartnerApplicationConfirmation(application.email, {
        name: application.name,
        application_id: application.id,
        status,
        review_notes
      }, false, true); // isAdmin = false, isStatusUpdate = true
    } catch (emailError) {
      console.error('Application status update email error:', emailError);
      // Don't fail the update if email fails
    }

    res.json({
      success: true,
      application: result.rows[0]
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Get partner application statistics (admin)
router.get('/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_applications,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_applications,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected_applications,
        ROUND(AVG(years_experience), 1) as avg_experience,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_applications
      FROM partner_applications
    `);

    // Get applications by preferred area
    const areaStats = await query(`
      SELECT preferred_area, COUNT(*) as count
      FROM partner_applications
      WHERE preferred_area IS NOT NULL
      GROUP BY preferred_area
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json({ 
      stats: stats.rows[0],
      area_distribution: areaStats.rows
    });
  } catch (error) {
    console.error('Get partner stats error:', error);
    res.status(500).json({ error: 'Failed to fetch partner statistics' });
  }
});

// Bulk update applications (admin)
router.put('/admin/bulk-update', authenticateAdmin, async (req, res) => {
  try {
    const { application_ids, status, review_notes } = req.body;
    const reviewedBy = req.user.id;

    if (!application_ids || !Array.isArray(application_ids) || application_ids.length === 0) {
      return res.status(400).json({ error: 'Application IDs array is required' });
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: pending, approved, rejected' 
      });
    }

    // Create placeholders for the IN clause
    const placeholders = application_ids.map((_, index) => `$${index + 1}`).join(',');
    
    const result = await query(`
      UPDATE partner_applications 
      SET status = $${application_ids.length + 1}, 
          review_notes = $${application_ids.length + 2}, 
          reviewed_by = $${application_ids.length + 3}
      WHERE id IN (${placeholders})
      RETURNING *
    `, [...application_ids, status, review_notes, reviewedBy]);

    res.json({
      success: true,
      updated_count: result.rows.length,
      applications: result.rows
    });
  } catch (error) {
    console.error('Bulk update applications error:', error);
    res.status(500).json({ error: 'Failed to bulk update applications' });
  }
});

module.exports = router;