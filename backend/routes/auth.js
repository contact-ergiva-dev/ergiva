const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const router = express.Router();

// Google OAuth login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed` }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: req.user.id, 
          email: req.user.email,
          is_admin: req.user.is_admin 
        },
        process.env.JWT_SECRET || 'ergiva-jwt-secret',
        { expiresIn: '24h' }
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  }
);

// Admin login (email/password - for admin panel)
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // For demo purposes, using simple admin check
    // In production, implement proper password hashing
    if (email === 'admin@ergiva.com' && password === 'admin123') {
      const result = await query(
        'SELECT * FROM users WHERE email = $1 AND is_admin = TRUE',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      const admin = result.rows[0];
      const token = jwt.sign(
        { 
          id: admin.id, 
          email: admin.email,
          is_admin: admin.is_admin 
        },
        process.env.JWT_SECRET || 'ergiva-jwt-secret',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          is_admin: admin.is_admin
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      profile_picture: req.user.profile_picture,
      phone: req.user.phone,
      address: req.user.address,
      is_admin: req.user.is_admin
    }
  });
});

// Update user profile
router.put('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user.id;

    const result = await query(
      'UPDATE users SET name = $1, phone = $2, address = $3 WHERE id = $4 RETURNING *',
      [name, phone, address, userId]
    );

    res.json({
      success: true,
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        phone: result.rows[0].phone,
        address: result.rows[0].address,
        profile_picture: result.rows[0].profile_picture
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Validate token
router.get('/validate', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;