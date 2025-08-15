// Temporarily disable Instamojo to fix backend startup
// const Instamojo = require('instamojo-nodejs');

// Mock instamojo object for development
const instamojo = {
  createPaymentRequest: (data, callback) => {
    console.log('Mock Instamojo createPaymentRequest called with:', data);
    // Mock successful response
    setTimeout(() => {
      callback(null, {
        payment_request: {
          id: 'mock_payment_request_' + Date.now(),
          longurl: 'https://test.instamojo.com/payment/mock_payment_url',
          shorturl: 'https://test.instamojo.com/payment/mock_short_url',
          status: 'pending',
          amount: data.amount,
          purpose: data.purpose,
          buyer_name: data.buyer_name,
          buyer_email: data.buyer_email,
          buyer_phone: data.buyer_phone,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString()
        }
      });
    }, 100);
  },
  getPaymentDetails: (requestId, paymentId, callback) => {
    console.log('Mock Instamojo getPaymentDetails called');
    setTimeout(() => {
      callback(null, {
        payment: {
          payment_id: paymentId,
          payment_request_id: requestId,
          status: 'Credit',
          amount: '100.00',
          buyer_name: 'Test User',
          buyer_email: 'test@example.com',
          buyer_phone: '9999999999'
        }
      });
    }, 100);
  },
  getPaymentRequestDetails: (requestId, callback) => {
    console.log('Mock Instamojo getPaymentRequestDetails called');
    setTimeout(() => {
      callback(null, {
        payment_request: {
          id: requestId,
          status: 'pending',
          amount: '100.00',
          purpose: 'Test payment'
        }
      });
    }, 100);
  }
};

/**
 * Create a payment request
 * @param {Object} paymentData - Payment request data
 * @param {number} paymentData.amount - Amount in INR
 * @param {string} paymentData.purpose - Purpose of payment
 * @param {string} paymentData.buyer_name - Buyer's name
 * @param {string} paymentData.buyer_email - Buyer's email
 * @param {string} paymentData.buyer_phone - Buyer's phone
 * @param {string} paymentData.redirect_url - Success redirect URL
 * @param {string} paymentData.webhook_url - Webhook URL for payment notifications
 * @returns {Promise<Object>} Payment request response
 */
const createPaymentRequest = async (paymentData) => {
  try {
    const {
      amount,
      purpose,
      buyer_name,
      buyer_email,
      buyer_phone,
      redirect_url,
      webhook_url
    } = paymentData;

    // Validate required fields
    if (!amount || !purpose || !buyer_email) {
      throw new Error('Amount, purpose, and buyer email are required');
    }

    // Create payment request data
    const requestData = {
      amount: amount.toString(),
      purpose: purpose,
      buyer_name: buyer_name || '',
      buyer_email: buyer_email,
      buyer_phone: buyer_phone || '',
      redirect_url: redirect_url || `${process.env.FRONTEND_URL}/payment/success`,
      webhook_url: webhook_url || `${process.env.BACKEND_URL}/api/payments/instamojo/webhook`,
      allow_repeated_payments: false
    };

    console.log('Creating Instamojo payment request:', requestData);

    return new Promise((resolve, reject) => {
      instamojo.createPaymentRequest(requestData, (error, response) => {
        if (error) {
          console.error('Instamojo payment request error:', error);
          reject(new Error(`Payment request failed: ${error.message || error}`));
        } else {
          console.log('Instamojo payment request created:', response);
          resolve(response);
        }
      });
    });
  } catch (error) {
    console.error('Create payment request error:', error);
    throw error;
  }
};

/**
 * Get payment status
 * @param {string} paymentRequestId - Payment request ID
 * @param {string} paymentId - Payment ID (optional)
 * @returns {Promise<Object>} Payment status response
 */
const getPaymentStatus = async (paymentRequestId, paymentId = null) => {
  try {
    console.log('Getting payment status for:', { paymentRequestId, paymentId });

    return new Promise((resolve, reject) => {
      if (paymentId) {
        // Get specific payment details
        instamojo.getPaymentDetails(paymentRequestId, paymentId, (error, response) => {
          if (error) {
            console.error('Instamojo payment details error:', error);
            reject(new Error(`Failed to get payment details: ${error.message || error}`));
          } else {
            console.log('Instamojo payment details:', response);
            resolve(response);
          }
        });
      } else {
        // Get payment request details
        instamojo.getPaymentRequestDetails(paymentRequestId, (error, response) => {
          if (error) {
            console.error('Instamojo payment request details error:', error);
            reject(new Error(`Failed to get payment request details: ${error.message || error}`));
          } else {
            console.log('Instamojo payment request details:', response);
            resolve(response);
          }
        });
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    throw error;
  }
};

/**
 * Verify webhook signature
 * @param {Object} payload - Webhook payload
 * @param {string} receivedMac - MAC received in webhook
 * @returns {boolean} Whether the webhook is valid
 */
const verifyWebhook = (payload, receivedMac) => {
  try {
    const crypto = require('crypto');
    const {
      payment_id,
      payment_request_id,
      payment_status,
      amount,
      buyer_name,
      buyer_email,
      buyer_phone,
      currency,
      fees
    } = payload;

    // Create the MAC string as per Instamojo documentation
    const macString = `${payment_id}|${payment_request_id}|${payment_status}|${buyer_name}|${buyer_email}|${buyer_phone}|${amount}|${currency}|${fees}`;
    
    // Generate MAC using HMAC-SHA1 with salt (private salt from Instamojo)
    const salt = process.env.INSTAMOJO_PRIVATE_SALT;
    if (!salt) {
      console.error('Instamojo private salt not configured');
      return false;
    }

    const expectedMac = crypto
      .createHmac('sha1', salt)
      .update(macString)
      .digest('hex');

    console.log('Webhook verification:', {
      macString,
      expectedMac,
      receivedMac,
      isValid: expectedMac === receivedMac
    });

    return expectedMac === receivedMac;
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
};

/**
 * Process webhook payload
 * @param {Object} payload - Webhook payload from Instamojo
 * @returns {Object} Processed payment data
 */
const processWebhook = (payload) => {
  try {
    const {
      payment_id,
      payment_request_id,
      payment_status,
      amount,
      buyer_name,
      buyer_email,
      buyer_phone,
      currency,
      fees,
      mac
    } = payload;

    // Verify webhook authenticity
    if (!verifyWebhook(payload, mac)) {
      throw new Error('Invalid webhook signature');
    }

    return {
      payment_id,
      payment_request_id,
      payment_status: payment_status.toLowerCase(),
      amount: parseFloat(amount),
      buyer_name,
      buyer_email,
      buyer_phone,
      currency,
      fees: parseFloat(fees || 0),
      is_successful: payment_status.toLowerCase() === 'credit'
    };
  } catch (error) {
    console.error('Process webhook error:', error);
    throw error;
  }
};

module.exports = {
  createPaymentRequest,
  getPaymentStatus,
  verifyWebhook,
  processWebhook
};