import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { 
  ShoppingBagIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  TruckIcon, 
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface Order {
  id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  shipping_address: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  order_notes?: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

const OrdersPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Wait for authentication to be determined before checking
    if (isLoading) {
      return; // Still loading, don't redirect yet
    }

    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/orders');
      return;
    }

    // Only fetch orders if user is authenticated
    if (user && user.id) {
      fetchOrders();
    }
  }, [isAuthenticated, isLoading, user, router]);

  const fetchOrders = async () => {
    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        console.error('No auth token found');
        toast.error('Authentication required');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform the data to match the expected interface
        const transformedOrders = (data.orders || []).map((order: any) => {
          return {
            ...order,
            order_items: order.items || [],
            shipping_address: order.shipping_address || {}
          };
        });
        setOrders(transformedOrders);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Show loading spinner while authentication is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show loading spinner while fetching orders
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Head>
        <title>My Orders - Ergiva</title>
        <meta name="description" content="View your order history and track your orders" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <ShoppingBagIcon className="h-8 w-8 text-primary-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here.</p>
              <Link
                href="/shop"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                                                 <div className="flex items-center">
                           {getStatusIcon(order.status)}
                           <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                             {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                           </span>
                         </div>
                        <div className="text-sm text-gray-500">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </div>
                      </div>
                                             <div className="flex items-center space-x-4">
                         <div className="text-right">
                           <div className="text-sm font-medium text-gray-900">
                             {formatCurrency(order.total_amount)}
                           </div>
                           <div className="text-xs text-gray-500">
                             Order Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                           </div>
                         </div>
                        <button
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="text-primary-600 hover:text-primary-500"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Collapsible) */}
                  {selectedOrder?.id === order.id && (
                    <div className="px-6 py-4 bg-gray-50">
                      {/* Order Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Order Information</h4>
                                                     <div className="space-y-1 text-sm text-gray-600">
                             <div className="flex items-center">
                               <CalendarIcon className="h-4 w-4 mr-2" />
                               Ordered: {formatDate(order.created_at)}
                             </div>
                             <div className="flex items-center">
                               <CurrencyRupeeIcon className="h-4 w-4 mr-2" />
                               Total: {formatCurrency(order.total_amount)}
                             </div>
                             <div className="font-medium">Order Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
                             <div>Payment Method: {order.payment_method}</div>
                             <div>Payment Status: {order.payment_status}</div>
                           </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                          <div className="text-sm text-gray-600">
                            <div>{order.shipping_address.name}</div>
                            <div>{order.shipping_address.address}</div>
                            <div>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</div>
                            <div>Phone: {order.shipping_address.phone}</div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg border">
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.product_name}
                                  className="h-16 w-16 object-cover rounded-md"
                                />
                              )}
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-gray-900">{item.product_name}</h5>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(item.price * item.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.order_notes && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Order Notes</h4>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                            {order.order_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
