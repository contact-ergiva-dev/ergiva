const express = require('express');
const { query } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Dashboard statistics
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Get current date and 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get general statistics
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE is_admin = FALSE) as total_users,
        (SELECT COUNT(*) FROM products WHERE is_active = TRUE) as total_products,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM sessions) as total_sessions,
        (SELECT COUNT(*) FROM partner_applications) as total_partner_applications,
        (SELECT COUNT(*) FROM testimonials WHERE is_active = TRUE) as total_testimonials,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'completed') as total_revenue,
        (SELECT COALESCE(SUM(amount), 0) FROM sessions WHERE payment_status = 'completed') as session_revenue
    `);

    // Get recent activity counts
    const recentActivity = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE created_at >= $1 AND is_admin = FALSE) as new_users_30d,
        (SELECT COUNT(*) FROM orders WHERE created_at >= $1) as new_orders_30d,
        (SELECT COUNT(*) FROM sessions WHERE created_at >= $1) as new_sessions_30d,
        (SELECT COUNT(*) FROM partner_applications WHERE created_at >= $1) as new_applications_30d
    `, [thirtyDaysAgo]);

    // Get order status distribution
    const orderStatus = await query(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `);

    // Get session status distribution
    const sessionStatus = await query(`
      SELECT status, COUNT(*) as count
      FROM sessions
      GROUP BY status
    `);

    // Get monthly revenue data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(total_amount) as order_revenue,
        COUNT(*) as order_count
      FROM orders
      WHERE created_at >= $1 AND payment_status = 'completed'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `, [sixMonthsAgo]);

    const monthlySessionRevenue = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(amount) as session_revenue,
        COUNT(*) as session_count
      FROM sessions
      WHERE created_at >= $1 AND payment_status = 'completed'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `, [sixMonthsAgo]);

    // Get top selling products
    const topProducts = await query(`
      SELECT 
        p.name,
        p.id,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as total_revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'completed'
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 10
    `);

    res.json({
      overview: {
        ...stats.rows[0],
        ...recentActivity.rows[0]
      },
      order_status_distribution: orderStatus.rows,
      session_status_distribution: sessionStatus.rows,
      monthly_revenue: monthlyRevenue.rows,
      monthly_session_revenue: monthlySessionRevenue.rows,
      top_products: topProducts.rows
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get recent activities
router.get('/recent-activities', authenticateAdmin, async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Get recent orders
    const recentOrders = await query(`
      SELECT 
        'order' as type,
        o.id,
        o.total_amount as amount,
        o.status,
        o.created_at,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT $1
    `, [Math.floor(limit / 4)]);

    // Get recent sessions
    const recentSessions = await query(`
      SELECT 
        'session' as type,
        s.id,
        s.amount,
        s.status,
        s.created_at,
        s.name as user_name,
        s.email as user_email
      FROM sessions s
      ORDER BY s.created_at DESC
      LIMIT $1
    `, [Math.floor(limit / 4)]);

    // Get recent partner applications
    const recentApplications = await query(`
      SELECT 
        'partner_application' as type,
        pa.id,
        NULL as amount,
        pa.status,
        pa.created_at,
        pa.name as user_name,
        pa.email as user_email
      FROM partner_applications pa
      ORDER BY pa.created_at DESC
      LIMIT $1
    `, [Math.floor(limit / 4)]);

    // Get recent users
    const recentUsers = await query(`
      SELECT 
        'user' as type,
        u.id,
        NULL as amount,
        'registered' as status,
        u.created_at,
        u.name as user_name,
        u.email as user_email
      FROM users u
      WHERE is_admin = FALSE
      ORDER BY u.created_at DESC
      LIMIT $1
    `, [Math.floor(limit / 4)]);

    // Combine and sort all activities
    const allActivities = [
      ...recentOrders.rows,
      ...recentSessions.rows,
      ...recentApplications.rows,
      ...recentUsers.rows
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      activities: allActivities.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({ error: 'Failed to fetch recent activities' });
  }
});

// Get system health
router.get('/system-health', authenticateAdmin, async (req, res) => {
  try {
    // Database connection test
    const dbTest = await query('SELECT 1 as test');
    const dbHealthy = dbTest.rows.length > 0;

    // Get database stats
    const dbStats = await query(`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes
      FROM pg_stat_user_tables
      WHERE schemaname = 'public'
      ORDER BY (n_tup_ins + n_tup_upd + n_tup_del) DESC
      LIMIT 10
    `);

    // Get table sizes
    const tableSizes = await query(`
      SELECT 
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      LIMIT 10
    `);

    res.json({
      database: {
        healthy: dbHealthy,
        stats: dbStats.rows,
        table_sizes: tableSizes.rows
      },
      server: {
        uptime: process.uptime(),
        memory_usage: process.memoryUsage(),
        node_version: process.version,
        environment: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch system health',
      database: { healthy: false },
      server: {
        uptime: process.uptime(),
        memory_usage: process.memoryUsage(),
        node_version: process.version,
        environment: process.env.NODE_ENV || 'development'
      }
    });
  }
});

// Get users overview
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { limit = 20, offset = 0, search } = req.query;

    let queryText = `
      SELECT 
        id, name, email, phone, profile_picture, is_admin, created_at,
        (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count,
        (SELECT COUNT(*) FROM sessions WHERE user_id = users.id) as session_count
      FROM users
      WHERE 1=1
    `;
    const queryParams = [];
    let paramIndex = 1;

    if (search) {
      queryText += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex + 1})`;
      queryParams.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await query(queryText, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;

    if (search) {
      countQuery += ` AND (name ILIKE $${countParamIndex} OR email ILIKE $${countParamIndex + 1})`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const countResult = await query(countQuery, countParams);

    res.json({
      users: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user admin status
router.put('/users/:id/admin', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_admin } = req.body;

    const result = await query(
      'UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING *',
      [is_admin, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user admin status error:', error);
    res.status(500).json({ error: 'Failed to update user admin status' });
  }
});

// Get activity logs
router.get('/logs', authenticateAdmin, async (req, res) => {
  try {
    const { limit = 50, offset = 0, action, table_name } = req.query;

    let queryText = `
      SELECT 
        al.*,
        u.name as admin_name,
        u.email as admin_email
      FROM admin_logs al
      LEFT JOIN users u ON al.admin_id = u.id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramIndex = 1;

    if (action) {
      queryText += ` AND al.action ILIKE $${paramIndex}`;
      queryParams.push(`%${action}%`);
      paramIndex++;
    }

    if (table_name) {
      queryText += ` AND al.table_name = $${paramIndex}`;
      queryParams.push(table_name);
      paramIndex++;
    }

    queryText += ` ORDER BY al.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await query(queryText, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM admin_logs al WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;

    if (action) {
      countQuery += ` AND al.action ILIKE $${countParamIndex}`;
      countParams.push(`%${action}%`);
      countParamIndex++;
    }

    if (table_name) {
      countQuery += ` AND al.table_name = $${countParamIndex}`;
      countParams.push(table_name);
    }

    const countResult = await query(countQuery, countParams);

    res.json({
      logs: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get admin logs error:', error);
    res.status(500).json({ error: 'Failed to fetch admin logs' });
  }
});

// Log admin action (utility function for other routes)
const logAdminAction = async (adminId, action, tableName, recordId, oldValues, newValues, ipAddress) => {
  try {
    await query(`
      INSERT INTO admin_logs 
      (admin_id, action, table_name, record_id, old_values, new_values, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [adminId, action, tableName, recordId, oldValues, newValues, ipAddress]);
  } catch (error) {
    console.error('Log admin action error:', error);
  }
};

module.exports = router;