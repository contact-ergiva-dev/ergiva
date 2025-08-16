const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ergiva-jwt-secret');
    
    // Get user from database
    const result = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ergiva-jwt-secret');
    
    // Check if this is the hardcoded admin user
    if (decoded.id === 'admin-user-id' && decoded.is_admin === true) {
      // Create admin user object without database query
      req.user = {
        id: 'admin-user-id',
        email: 'admin@ergiva.com',
        name: 'Ergiva Admin',
        is_admin: true
      };
      return next();
    }
    
    // For regular users, check database
    const result = await query(
      'SELECT * FROM users WHERE id = $1 AND is_admin = TRUE', 
      [decoded.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Admin token verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Optional authentication middleware (for routes that work both with and without auth)
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ergiva-jwt-secret');
    
    const result = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    
    if (result.rows.length > 0) {
      req.user = result.rows[0];
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }

  next();
};

module.exports = {
  authenticateToken,
  authenticateAdmin,
  optionalAuth
};