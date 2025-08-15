import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { Product, CartItem, CartContextType } from '@/types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

const CART_STORAGE_KEY = 'ergiva_cart';

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Calculate total items count
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate total amount
  const totalAmount = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Add item to cart
  const addItem = (product: Product, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity of existing item
        const newQuantity = existingItem.quantity + quantity;
        
        // Check stock availability
        if (newQuantity > product.stock_quantity) {
          toast.error(`Sorry, only ${product.stock_quantity} items available in stock`);
          return currentItems;
        }
        
        toast.success(`Updated ${product.name} quantity in cart`);
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Add new item
        if (quantity > product.stock_quantity) {
          toast.error(`Sorry, only ${product.stock_quantity} items available in stock`);
          return currentItems;
        }
        
        toast.success(`Added ${product.name} to cart`);
        return [...currentItems, { product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    setItems((currentItems) => {
      const item = currentItems.find(item => item.product.id === productId);
      if (item) {
        toast.success(`Removed ${item.product.name} from cart`);
      }
      return currentItems.filter(item => item.product.id !== productId);
    });
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) => {
      return currentItems.map(item => {
        if (item.product.id === productId) {
          // Check stock availability
          if (quantity > item.product.stock_quantity) {
            toast.error(`Sorry, only ${item.product.stock_quantity} items available in stock`);
            return item;
          }
          
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  // Check if product is in cart
  const isInCart = (productId: string): boolean => {
    return items.some(item => item.product.id === productId);
  };

  // Get quantity of specific item in cart
  const getItemQuantity = (productId: string): number => {
    const item = items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};