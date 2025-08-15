import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/lib/cart/CartContext';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category_name: string;
  image_urls: string[];
  features: string[];
  stock_quantity: number;
}

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/featured');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      category_id: '',
      category_name: product.category_name,
      image_urls: product.image_urls,
      stock_quantity: product.stock_quantity,
      features: product.features,
      specifications: {},
      is_active: true,
      created_at: '',
      updated_at: ''
    });
  };

  if (loading) {
    return (
      <section className="py-8 md:py-10 bg-white">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="container-custom">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-responsive-lg font-bold text-gray-900">
            Featured{' '}
            <span className="text-gradient-primary">Products</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quality rehabilitation equipment and physiotherapy products for home use.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2 group overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={product.image_urls[0] || '/images/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {product.category_name}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                    <StarSolidIcon className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs font-medium">4.8</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {product.features.length > 2 && (
                      <span className="text-xs text-gray-500">+{product.features.length - 2} more</span>
                    )}
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(parseFloat(product.price))}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    <span className="text-sm">Add</span>
                  </button>
                </div>

                {/* Stock Status */}
                <div className="mt-3 text-center">
                  {product.stock_quantity > 0 ? (
                    <span className="text-xs text-green-600">✓ In Stock ({product.stock_quantity} available)</span>
                  ) : (
                    <span className="text-xs text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center mt-8">
          <Link 
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            View All Products
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;