import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart/CartContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { TrashIcon, MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose }) => {
  const { items, totalItems, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <p className="text-sm text-gray-500">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m8.5-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m8.5 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 text-center mb-6">Add some products to your cart to get started</p>
                <Link 
                  href="/shop" 
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-start space-x-4 bg-gray-50 rounded-lg p-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                        {item.product.image_urls?.[0] ? (
                          <Image
                            src={item.product.image_urls[0]}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Product';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">₹{item.product.price.toLocaleString()}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-semibold text-primary-600">₹{totalAmount.toLocaleString()}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block"
                >
                  View Cart
                </Link>
                {isAuthenticated ? (
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center block"
                  >
                    Checkout
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-800 text-center">
                        Please log in to proceed with checkout
                      </p>
                    </div>
                    <Link
                      href={`/auth/login?redirect=${encodeURIComponent('/checkout')}`}
                      onClick={onClose}
                      className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center block"
                    >
                      Sign In to Checkout
                    </Link>
                  </div>
                )}
              </div>

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full text-red-500 hover:text-red-700 text-sm font-medium py-2"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;