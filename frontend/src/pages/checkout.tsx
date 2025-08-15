import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCart } from '@/lib/cart/CartContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { ShoppingBagIcon, ArrowLeftIcon, CreditCardIcon, TruckIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { items, totalItems, totalAmount, clearCart } = useCart();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'instamojo' | 'pay_on_visit'>('instamojo');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  // Check authentication on mount
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login with current path as redirect parameter
      router.push(`/auth/login?redirect=${encodeURIComponent('/checkout')}`);
    }
  }, [isAuthenticated, isLoading, router]);

  // Update form data when user data becomes available
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        toast.error(`Please fill in the ${field.replace('_', ' ')} field`);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Validate phone format
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(shippingAddress.phone)) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    // Validate pincode
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(shippingAddress.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        })),
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        order_notes: ''
      };

      // Create order
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear cart
        clearCart();

        if (paymentMethod === 'instamojo' && data.order.instamojo_payment) {
          // Redirect to Instamojo payment page
          window.location.href = data.order.instamojo_payment.longurl;
        } else {
          // For Pay on Visit, redirect to success page
          toast.success('Order placed successfully! We will contact you shortly.');
          window.location.href = `/order/success?order_id=${data.order.id}`;
        }
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <>
        <Head>
          <title>Checkout - Ergiva</title>
          <meta name="description" content="Complete your order checkout" />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </>
    );
  }

  // Show authentication required if not logged in
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Login Required - Ergiva</title>
          <meta name="description" content="Please login to continue with checkout" />
        </Head>

        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserIcon className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
              <p className="text-gray-600 mb-8">
                Please log in to your account to proceed with checkout.
              </p>
              <div className="space-y-4">
                <Link
                  href={`/auth/login?redirect=${encodeURIComponent('/checkout')}`}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Sign In to Continue
                </Link>
                <div>
                  <Link
                    href={`/auth/register?redirect=${encodeURIComponent('/checkout')}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Don't have an account? Create one
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>Checkout - Ergiva</title>
          <meta name="description" content="Complete your order checkout" />
        </Head>

        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Add some products to your cart before proceeding to checkout.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - Ergiva</title>
        <meta name="description" content="Complete your order checkout" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/cart" 
                  className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Back to Cart
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <div className="w-32"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit}>
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
              {/* Main Content */}
              <div className="lg:col-span-8 space-y-8">
                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      1
                    </div>
                    <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={shippingAddress.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter 6-digit pincode"
                        maxLength={6}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your full address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your city"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Select State</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={shippingAddress.landmark}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Nearby landmark"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      2
                    </div>
                    <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment_method"
                        value="instamojo"
                        checked={paymentMethod === 'instamojo'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'instamojo' | 'pay_on_visit')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CreditCardIcon className="w-5 h-5 text-primary-600" />
                          <span className="font-medium">Online Payment</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Pay securely using UPI, Credit/Debit Card, Net Banking
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment_method"
                        value="pay_on_visit"
                        checked={paymentMethod === 'pay_on_visit'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'instamojo' | 'pay_on_visit')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <TruckIcon className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Pay when your order is delivered
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-8 lg:mt-0 lg:col-span-4">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {item.product.image_urls?.[0] ? (
                              <Image
                                src={item.product.image_urls[0]}
                                alt={item.product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Product';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-900">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>Included</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>

                  {/* Security Badge */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <ShieldCheckIcon className="w-4 h-4" />
                      <span>Secure & encrypted checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;