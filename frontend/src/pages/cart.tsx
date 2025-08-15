import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart/CartContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { items, totalItems, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <>
      <Head>
        <title>Shopping Cart - Ergiva</title>
        <meta name="description" content="Review and manage items in your shopping cart" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/shop" 
                  className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <div className="w-32"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Browse our collection and find something you like!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
              {/* Cart Items */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-lg shadow-sm">
                  {/* Cart Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900">
                        Cart Items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                      </h2>
                      <button
                        onClick={handleClearCart}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div key={item.product.id} className="p-6">
                        <div className="flex items-start space-x-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                              {item.product.image_urls?.[0] ? (
                                <Image
                                  src={item.product.image_urls[0]}
                                  alt={item.product.name}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/96x96?text=Product';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-400 text-sm">No Image</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.product.description}</p>
                                <p className="text-sm text-gray-500 mt-1">Category: {item.product.category_name}</p>
                                
                                {/* Features */}
                                {item.product.features && item.product.features.length > 0 && (
                                  <div className="mt-2">
                                    <div className="flex flex-wrap gap-1">
                                      {item.product.features.slice(0, 3).map((feature, index) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                        >
                                          {feature}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="text-red-500 hover:text-red-700 p-2"
                                title="Remove item"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-semibold text-gray-900">
                                  ₹{item.product.price.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500">per item</span>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500">Qty:</span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                  >
                                    <MinusIcon className="w-4 h-4" />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    max={item.product.stock_quantity}
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 1)}
                                    className="w-16 text-center border border-gray-300 rounded-md py-1"
                                  />
                                  <button
                                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                  >
                                    <PlusIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Item Total */}
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                  ₹{(item.product.price * item.quantity).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity} × ₹{item.product.price.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Stock Warning */}
                            {item.quantity >= item.product.stock_quantity && (
                              <div className="mt-2 text-sm text-amber-600">
                                Only {item.product.stock_quantity} items available in stock
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-8 lg:mt-0 lg:col-span-4">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  
                  {/* Summary Items */}
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
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="space-y-3">
                    {isAuthenticated ? (
                      <Link
                        href="/checkout"
                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center block"
                      >
                        Proceed to Checkout
                      </Link>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <p className="text-sm text-amber-800 text-center mb-2">
                            Please log in to proceed with checkout
                          </p>
                          <p className="text-xs text-amber-700 text-center">
                            You can still book sessions and join as a physio without an account
                          </p>
                        </div>
                        <Link
                          href={`/auth/login?redirect=${encodeURIComponent('/checkout')}`}
                          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center block"
                        >
                          Sign In to Checkout
                        </Link>
                        <Link
                          href={`/auth/register?redirect=${encodeURIComponent('/checkout')}`}
                          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                    <Link
                      href="/shop"
                      className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  {/* Security Badges */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Secure Checkout
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Free Returns
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;