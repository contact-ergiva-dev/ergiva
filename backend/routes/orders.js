const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, authenticateAdmin, optionalAuth } = require('../middleware/auth');
const { sendOrderConfirmation } = require('../services/emailService');
const { createPaymentRequest, getPaymentStatus, processWebhook } = require('../services/instamojoService');
const router = express.Router();

// Create order
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      items,
      shipping_address,
      payment_method,
      order_notes
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    if (!shipping_address) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    const userId = req.user ? req.user.id : null;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    // Validate items and calculate total
    for (const item of items) {
      const productResult = await query(
        'SELECT id, name, price, stock_quantity FROM products WHERE id = $1 AND is_active = true',
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        return res.status(400).json({ error: `Product not found: ${item.product_id}` });
      }

      const product = productResult.rows[0];

      if (item.quantity > product.stock_quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}` 
        });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        price: parseFloat(product.price)
      });
    }

    // Create order
    const orderResult = await query(`
      INSERT INTO orders 
      (user_id, total_amount, status, payment_method, payment_status, shipping_address, order_notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `, [
      userId,
      totalAmount,
      'pending',
      payment_method,
      'pending',
      JSON.stringify(shipping_address),
      order_notes
    ]);

    const order = orderResult.rows[0];

    // Insert order items
    for (const item of orderItems) {
      await query(`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
        VALUES ($1, $2, $3, $4, $5)
      `, [order.id, item.product_id, item.product_name, item.quantity, item.price]);

      // Update product stock
      await query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Handle payment based on method
    let paymentData = null;
    if (payment_method === 'instamojo') {
      try {
        const paymentRequest = await createPaymentRequest({
          amount: totalAmount,
          purpose: `Order #${order.id}`,
          buyer_name: shipping_address.name,
          buyer_email: shipping_address.email || req.user?.email,
          buyer_phone: shipping_address.phone,
          redirect_url: `${process.env.FRONTEND_URL}/order/success?order_id=${order.id}`,
          webhook_url: `${process.env.BACKEND_URL}/api/orders/instamojo/webhook`
        });

        // Update order with payment request ID
        await query(
          'UPDATE orders SET instamojo_payment_request_id = $1 WHERE id = $2',
          [paymentRequest.payment_request.id, order.id]
        );

        paymentData = paymentRequest.payment_request;
      } catch (paymentError) {
        console.error('Instamojo payment request error:', paymentError);
        // Don't fail the order creation, but mark payment as failed
        await query(
          'UPDATE orders SET payment_status = $1 WHERE id = $2',
          ['failed', order.id]
        );
      }
    }

    // Send confirmation emails
    try {
      const orderWithItems = {
        ...order,
        items: orderItems,
        shipping_address: shipping_address
      };

      await sendOrderConfirmation(
        shipping_address.email || req.user?.email,
        orderWithItems
      );

      // Send notification to admin
      await sendOrderConfirmation('admin@ergiva.com', orderWithItems, true);
    } catch (emailError) {
      console.error('Order confirmation email error:', emailError);
      // Don't fail the order if email fails
    }

    res.status(201).json({
      success: true,
      order: {
        ...order,
        items: orderItems,
        instamojo_payment: paymentData
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Instamojo webhook handler
router.post('/instamojo/webhook', async (req, res) => {
  try {
    console.log('Instamojo webhook received:', req.body);

    const webhookData = processWebhook(req.body);
    const { payment_request_id, payment_id, payment_status, is_successful } = webhookData;

    // Find order by payment request ID
    const orderResult = await query(
      'SELECT * FROM orders WHERE instamojo_payment_request_id = $1',
      [payment_request_id]
    );

    if (orderResult.rows.length === 0) {
      console.error('Order not found for payment request:', payment_request_id);
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Update order payment status
    const newStatus = is_successful ? 'confirmed' : 'cancelled';
    const newPaymentStatus = is_successful ? 'completed' : 'failed';

    await query(`
      UPDATE orders 
      SET payment_status = $1, status = $2, instamojo_payment_id = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [newPaymentStatus, newStatus, payment_id, order.id]);

    console.log('Order payment status updated:', {
      orderId: order.id,
      paymentStatus: newPaymentStatus,
      orderStatus: newStatus
    });

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Instamojo webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Verify payment status
router.post('/verify-payment', async (req, res) => {
  try {
    const { order_id, payment_request_id, payment_id } = req.body;

    if (!order_id || !payment_request_id) {
      return res.status(400).json({ error: 'Order ID and payment request ID are required' });
    }

    // Get payment status from Instamojo
    const paymentStatus = await getPaymentStatus(payment_request_id, payment_id);

    // Find order
    const orderResult = await query('SELECT * FROM orders WHERE id = $1', [order_id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Check if payment is successful
    const isPaymentSuccessful = paymentStatus.payment_request.status === 'Completed' ||
                               (paymentStatus.payments && paymentStatus.payments.length > 0 &&
                                paymentStatus.payments[0].status === 'Credit');

    if (isPaymentSuccessful) {
      // Update order status
      await query(`
        UPDATE orders 
        SET payment_status = 'completed', status = 'confirmed', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [order_id]);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order: { ...order, payment_status: 'completed', status: 'confirmed' }
      });
    } else {
      res.json({
        success: false,
        message: 'Payment not completed',
        payment_status: paymentStatus.payment_request.status
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Get user orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const userId = req.user.id;

    const result = await query(`
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'product_name', oi.product_name,
                 'quantity', oi.quantity,
                 'price', oi.price
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, parseInt(limit), parseInt(offset)]);

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) FROM orders WHERE user_id = $1',
      [userId]
    );

    res.json({
      orders: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order details
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    let queryText = `
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'product_name', oi.product_name,
                 'quantity', oi.quantity,
                 'price', oi.price
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
    `;
    const queryParams = [id];

    // If user is authenticated, also check if they own the order
    if (req.user) {
      queryText += ' AND (o.user_id = $2 OR $3 = TRUE)';
      queryParams.push(req.user.id, req.user.is_admin);
    }

    queryText += ' GROUP BY o.id';

    const result = await query(queryText, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order: result.rows[0] });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Admin Routes

// Get all orders (admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { 
      limit = 20, 
      offset = 0, 
      status, 
      payment_status,
      payment_method,
      search 
    } = req.query;

    let queryText = `
      SELECT o.*, u.name as user_name,
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'product_name', oi.product_name,
                 'quantity', oi.quantity,
                 'price', oi.price
               )
             ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramIndex = 1;

    if (status) {
      queryText += ` AND o.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (payment_status) {
      queryText += ` AND o.payment_status = $${paramIndex}`;
      queryParams.push(payment_status);
      paramIndex++;
    }

    if (payment_method) {
      queryText += ` AND o.payment_method = $${paramIndex}`;
      queryParams.push(payment_method);
      paramIndex++;
    }

    if (search) {
      queryText += ` AND (o.id::text ILIKE $${paramIndex} OR u.name ILIKE $${paramIndex + 1})`;
      queryParams.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    queryText += ` GROUP BY o.id, u.name ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await query(queryText, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;

    if (status) {
      countQuery += ` AND o.status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }

    if (payment_status) {
      countQuery += ` AND o.payment_status = $${countParamIndex}`;
      countParams.push(payment_status);
      countParamIndex++;
    }

    if (payment_method) {
      countQuery += ` AND o.payment_method = $${countParamIndex}`;
      countParams.push(payment_method);
      countParamIndex++;
    }

    if (search) {
      countQuery += ` AND (o.id::text ILIKE $${countParamIndex} OR u.name ILIKE $${countParamIndex + 1})`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const countResult = await query(countQuery, countParams);

    res.json({
      orders: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (admin)
router.put('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status, tracking_number, admin_notes } = req.body;

    const result = await query(`
      UPDATE orders 
      SET status = COALESCE($1, status), 
          payment_status = COALESCE($2, payment_status),
          tracking_number = COALESCE($3, tracking_number),
          admin_notes = COALESCE($4, admin_notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 
      RETURNING *
    `, [status, payment_status, tracking_number, admin_notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get order statistics (admin)
router.get('/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_orders,
        COUNT(*) FILTER (WHERE status = 'shipped') as shipped_orders,
        COUNT(*) FILTER (WHERE status = 'delivered') as delivered_orders,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders,
        COUNT(*) FILTER (WHERE payment_status = 'completed') as paid_orders,
        SUM(total_amount) FILTER (WHERE payment_status = 'completed') as total_revenue,
        AVG(total_amount) FILTER (WHERE payment_status = 'completed') as average_order_value
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json({ stats: stats.rows[0] });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

module.exports = router;