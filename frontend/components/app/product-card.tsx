'use client';

import React from 'react';
import { ShoppingCart } from '@phosphor-icons/react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image_url?: string;
  attributes: {
    color?: string;
    sizes?: string[];
    [key: string]: any;
  };
  in_stock: boolean;
}

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

export function ProductCard({ product, onBuy }: ProductCardProps) {
  const getCategoryEmoji = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mug': return '☕';
      case 'hoodie': return '🧥';
      case 'tshirt': return '👕';
      case 'cap': return '🧢';
      default: return '🛍️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mug': return 'from-amber-500 to-orange-600';
      case 'hoodie': return 'from-purple-500 to-pink-600';
      case 'tshirt': return 'from-blue-500 to-cyan-600';
      case 'cap': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1">
      {/* Product Image with Hover Effect */}
      <div className="relative w-full h-64 bg-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(product.category)} flex items-center justify-center`}>
            <span className="text-8xl transform group-hover:scale-110 transition-transform duration-300">
              {getCategoryEmoji(product.category)}
            </span>
          </div>
        )}
        
        {/* Stock Badge */}
        {product.in_stock ? (
          <div className="absolute top-3 right-3 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full z-20">
            ✓ In Stock
          </div>
        ) : (
          <div className="absolute top-3 right-3 px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full z-20">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        <h3 className="text-slate-900 font-bold text-lg line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Attributes */}
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {product.attributes.color && (
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-300">
              🎨 {product.attributes.color}
            </span>
          )}
          {product.attributes.sizes && (
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-300">
              📏 {product.attributes.sizes.join(', ')}
            </span>
          )}
        </div>

        {/* Price and Buy Button */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                ₹{product.price}
              </div>
              <div className="text-slate-500 text-xs">
                {product.currency}
              </div>
            </div>
          </div>

          <button
            onClick={() => onBuy(product)}
            disabled={!product.in_stock}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-blue-500/30"
          >
            <ShoppingCart size={20} weight="bold" />
            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
