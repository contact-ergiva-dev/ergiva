const express = require('express');
const Razorpay = require('razorpay');
const { query } = require('../config/database');
const { authenticateToken, authenticateAdmin, optionalAuth } = require('../middleware/auth');
const { sendSessionConfirmation } = require('../services/emailService');
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Book a physiotherapy session
router.post('/book', optionalAuth, async (req, res) => {
  try {
    const {
      name,
      age,
      contact,
      email,
      address,
      condition_description,
      preferred_time,
      session_type = 'home_visit', // 'home_visit' or 'online_consultation'
      payment_method // 'razorpay' or 'pay_on_visit'
    } = req.body;

    // Set session amount based on type
    let amount = 0;
    if (session_type === 'home_visit') {
      amount = 1500; // Base price for home visit
    } else if (session_type === 'online_consultation') {
      amount = 800; // Base price for online consultation
    }

    const userId = req.user ? req.user.id : null;

    // Create session booking
    const result = await query(`
      INSERT INTO sessions 
      (user_id, name, age, contact, email, address, condition_description, 
       preferred_time, session_type, payment_method, amount)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *
    `, [
      userId, name, age, contact, email, address, condition_description,
      preferred_time, session_type, payment_method, amount
    ]);

    const session = result.rows[0];

    // Handle payment based on method
    let razorpayOrder = null;
    if (payment_method === 'razorpay') {
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: Math.round(amount * 100), // Convert to paise
          currency: 'INR',
          receipt: session.id,
          notes: {
            session_id: session.id,
            user_id: userId || 'guest',
            session_type: session_type
          }
        });

        // Update session with Razorpay order ID
        await query(
          'UPDATE sessions SET razorpay_order_id = $1 WHERE id = $2',
          [razorpayOrder.id, session.id]
        );
      } catch (razorpayError) {
        console.error('Razorpay session order creation error:', razorpayError);
        return res.status(500).json({ error: 'Payment order creation failed' });
      }
    }

    // Send confirmation emails
    try {
      await sendSessionConfirmation(email, {
        session_id: session.id,
        name,
        preferred_time,
        session_type,
        amount,
        payment_method
      });

      // Send notification to admin
      await sendSessionConfirmation('admin@ergiva.com', {
        session_id: session.id,
        name,
        contact,
        email,
        address,
        condition_description,
        preferred_time,
        session_type,
        amount,
        payment_method
      }, true); // isAdmin = true
    } catch (emailError) {
      console.error('Session confirmation email error:', emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      session: {
        ...session,
        razorpay_order: razorpayOrder
      }
    });
  } catch (error) {
    console.error('Book session error:', error);
    res.status(500).json({ error: 'Failed to book session' });
  }
});

// Verify session payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      session_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const crypto = require('crypto');
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Update session payment status
    const result = await query(`
      UPDATE sessions 
      SET payment_status = 'completed', razorpay_payment_id = $1, status = 'confirmed'
      WHERE id = $2 AND razorpay_order_id = $3
      RETURNING *
    `, [razorpay_payment_id, session_id, razorpay_order_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      session: result.rows[0]
    });
  } catch (error) {
    console.error('Session payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Get user sessions
router.get('/my-sessions', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const userId = req.user.id;

    const result = await query(`
      SELECT * FROM sessions 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, parseInt(limit), parseInt(offset)]);

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) FROM sessions WHERE user_id = $1',
      [userId]
    );

    res.json({
      sessions: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get single session details
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    let queryText = 'SELECT * FROM sessions WHERE id = $1';
    const queryParams = [id];

    // If user is authenticated, also check if they own the session
    if (req.user) {
      queryText += ' AND (user_id = $2 OR $3 = TRUE)';
      queryParams.push(req.user.id, req.user.is_admin);
    }

    const result = await query(queryText, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session: result.rows[0] });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Admin Routes

// Get all sessions (simple endpoint for admin)
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id,
        name as "patientName",
        email as "patientEmail", 
        contact as "patientPhone",
        age,
        condition_description as condition,
        address,
        preferred_time as "preferredTime",
        DATE(preferred_time) as "preferredDate",
        session_notes as notes,
        created_at as "createdAt"
      FROM sessions 
      ORDER BY created_at DESC
      LIMIT 50
    `);

    res.json({
      success: true,
      sessions: result.rows
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get all sessions (admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { 
      limit = 20, 
      offset = 0, 
      status, 
      session_type,
      payment_status,
      search 
    } = req.query;

    let queryText = `
      SELECT s.*, u.name as user_name 
      FROM sessions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramIndex = 1;

    if (status) {
      queryText += ` AND s.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (session_type) {
      queryText += ` AND s.session_type = $${paramIndex}`;
      queryParams.push(session_type);
      paramIndex++;
    }

    if (payment_status) {
      queryText += ` AND s.payment_status = $${paramIndex}`;
      queryParams.push(payment_status);
      paramIndex++;
    }

    if (search) {
      queryText += ` AND (s.name ILIKE $${paramIndex} OR s.email ILIKE $${paramIndex + 1} OR s.contact ILIKE $${paramIndex + 2})`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      paramIndex += 3;
    }

    queryText += ` ORDER BY s.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await query(queryText, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM sessions s LEFT JOIN users u ON s.user_id = u.id WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;

    if (status) {
      countQuery += ` AND s.status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }

    if (session_type) {
      countQuery += ` AND s.session_type = $${countParamIndex}`;
      countParams.push(session_type);
      countParamIndex++;
    }

    if (payment_status) {
      countQuery += ` AND s.payment_status = $${countParamIndex}`;
      countParams.push(payment_status);
      countParamIndex++;
    }

    if (search) {
      countQuery += ` AND (s.name ILIKE $${countParamIndex} OR s.email ILIKE $${countParamIndex + 1} OR s.contact ILIKE $${countParamIndex + 2})`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const countResult = await query(countQuery, countParams);

    res.json({
      sessions: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Admin get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Update session status (admin)
router.put('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      status, 
      payment_status, 
      assigned_physio_id, 
      session_notes 
    } = req.body;

    const result = await query(`
      UPDATE sessions 
      SET status = COALESCE($1, status), 
          payment_status = COALESCE($2, payment_status),
          assigned_physio_id = COALESCE($3, assigned_physio_id),
          session_notes = COALESCE($4, session_notes)
      WHERE id = $5 
      RETURNING *
    `, [status, payment_status, assigned_physio_id, session_notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      session: result.rows[0]
    });
  } catch (error) {
    console.error('Update session status error:', error);
    res.status(500).json({ error: 'Failed to update session status' });
  }
});

// Get session statistics (admin)
router.get('/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_sessions,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_sessions,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
        COUNT(*) FILTER (WHERE payment_status = 'completed') as paid_sessions,
        SUM(amount) FILTER (WHERE payment_status = 'completed') as total_revenue,
        COUNT(*) FILTER (WHERE session_type = 'home_visit') as home_visits,
        COUNT(*) FILTER (WHERE session_type = 'online_consultation') as online_consultations
      FROM sessions
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json({ stats: stats.rows[0] });
  } catch (error) {
    console.error('Get session stats error:', error);
    res.status(500).json({ error: 'Failed to fetch session statistics' });
  }
});

module.exports = router;