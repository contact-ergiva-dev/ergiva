import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CheckCircleIcon, PrinterIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_address: any;
  items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
  created_at: string;
}

const OrderSuccessPage: React.FC = () => {
  const router = useRouter();
  const { order_id, payment_id, payment_request_id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (order_id) {
      fetchOrderDetails();
    }
  }, [order_id, payment_id, payment_request_id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);

      // If payment details are available, verify payment first
      if (payment_id && payment_request_id) {
        await verifyPayment();
      }

      // Fetch order details
      const response = await fetch(`http://localhost:5000/api/orders/${order_id}`);
      const data = await response.json();

      if (response.ok && data.order) {
        setOrder(data.order);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id,
          payment_request_id,
          payment_id
        }),
      });

      const data = await response.json();
      console.log('Payment verification result:', data);
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Order Processing - Ergiva</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your order...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Head>
          <title>Order Error - Ergiva</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  const shippingAddress = typeof order.shipping_address === 'string' 
    ? JSON.parse(order.shipping_address) 
    : order.shipping_address;

  return (
    <>
      <Head>
        <title>Order Confirmation - Ergiva</title>
        <meta name="description" content="Your order has been placed successfully" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <p className="text-sm text-gray-500">
              Order ID: <span className="font-medium text-gray-900">#{order.id}</span>
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Status */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Method</p>
                    <span className="text-sm text-gray-600">
                      {order.payment_method === 'instamojo' ? 'Online Payment' : 'Cash on Delivery'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Items Ordered</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.quantity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{item.price.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ₹{(item.quantity * item.price).toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Total */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-600">₹{order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-700">
                    <p className="font-medium text-gray-900">{shippingAddress.name}</p>
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                    <p>Phone: {shippingAddress.phone}</p>
                    <p>Email: {shippingAddress.email}</p>
                    {shippingAddress.landmark && <p>Landmark: {shippingAddress.landmark}</p>}
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">What's Next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Confirmation</p>
                      <p className="text-sm text-gray-600">You'll receive an email confirmation shortly.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Processing</p>
                      <p className="text-sm text-gray-600">We'll prepare your order for shipment.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Shipping</p>
                      <p className="text-sm text-gray-600">Your order will be shipped within 2-3 business days.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Continue Shopping
            </Link>
            {/* <Link
              href="/orders"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              View All Orders
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Link> */}
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              Need help with your order?{' '}
              <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;