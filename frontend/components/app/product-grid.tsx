'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from './product-card';
import { Funnel, MagnifyingGlass } from '@phosphor-icons/react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image_url?: string;
  attributes: any;
  in_stock: boolean;
}

interface ProductGridProps {
  onProductBuy: (product: Product) => void;
}

export function ProductGrid({ onProductBuy }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // For now, use static data (you can add API endpoint later)
      const staticProducts: Product[] = [
        {
          id: "mug-001",
          name: "Ceramic Coffee Mug - White",
          description: "Classic white ceramic mug, 350ml capacity",
          price: 299,
          currency: "INR",
          category: "mug",
          image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop",
          attributes: { color: "white", material: "ceramic" },
          in_stock: true
        },
        {
          id: "mug-002",
          name: "Ceramic Coffee Mug - Black",
          description: "Elegant black ceramic mug, 350ml capacity",
          price: 299,
          currency: "INR",
          category: "mug",
          image_url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&h=500&fit=crop",
          attributes: { color: "black", material: "ceramic" },
          in_stock: true
        },
        {
          id: "mug-003",
          name: "Travel Mug - Stainless Steel",
          description: "Insulated travel mug, keeps drinks hot for 6 hours",
          price: 599,
          currency: "INR",
          category: "mug",
          image_url: "https://images.unsplash.com/photo-1534889156217-d643df14f14a?w=500&h=500&fit=crop",
          attributes: { color: "silver", material: "stainless steel" },
          in_stock: true
        },
        {
          id: "hoodie-001",
          name: "Cotton Hoodie - Black",
          description: "Comfortable cotton hoodie with front pocket",
          price: 1299,
          currency: "INR",
          category: "hoodie",
          image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
          attributes: { color: "black", sizes: ["S", "M", "L", "XL"] },
          in_stock: true
        },
        {
          id: "hoodie-002",
          name: "Cotton Hoodie - Navy Blue",
          description: "Premium navy blue hoodie with zipper",
          price: 1499,
          currency: "INR",
          category: "hoodie",
          image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=500&fit=crop",
          attributes: { color: "navy blue", sizes: ["S", "M", "L", "XL"] },
          in_stock: true
        },
        {
          id: "hoodie-003",
          name: "Fleece Hoodie - Grey",
          description: "Warm fleece hoodie perfect for winter",
          price: 1799,
          currency: "INR",
          category: "hoodie",
          image_url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=500&fit=crop",
          attributes: { color: "grey", sizes: ["M", "L", "XL", "XXL"] },
          in_stock: true
        },
        {
          id: "tshirt-001",
          name: "Cotton T-Shirt - White",
          description: "Basic white cotton t-shirt",
          price: 399,
          currency: "INR",
          category: "tshirt",
          image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
          attributes: { color: "white", sizes: ["S", "M", "L", "XL"] },
          in_stock: true
        },
        {
          id: "tshirt-002",
          name: "Cotton T-Shirt - Black",
          description: "Classic black cotton t-shirt",
          price: 399,
          currency: "INR",
          category: "tshirt",
          image_url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=500&fit=crop",
          attributes: { color: "black", sizes: ["S", "M", "L", "XL"] },
          in_stock: true
        },
        {
          id: "tshirt-003",
          name: "Graphic T-Shirt - Blue",
          description: "Cool graphic print t-shirt",
          price: 599,
          currency: "INR",
          category: "tshirt",
          image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop",
          attributes: { color: "blue", sizes: ["M", "L", "XL"] },
          in_stock: true
        },
        {
          id: "cap-001",
          name: "Baseball Cap - Black",
          description: "Adjustable baseball cap",
          price: 349,
          currency: "INR",
          category: "cap",
          image_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop",
          attributes: { color: "black", adjustable: true },
          in_stock: true
        }
      ];
      
      setProducts(staticProducts);
      setFilteredProducts(staticProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const categories = [
    { id: 'all', name: 'All Products', emoji: '🛍️' },
    { id: 'mug', name: 'Mugs', emoji: '☕' },
    { id: 'hoodie', name: 'Hoodies', emoji: '🧥' },
    { id: 'tshirt', name: 'T-Shirts', emoji: '👕' },
    { id: 'cap', name: 'Caps', emoji: '🧢' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <span className="text-4xl">🛍️</span>
            Product Catalog
          </h2>
          <div className="text-right">
            <p className="text-sm text-slate-600">Browse our collection</p>
            <p className="text-xs text-blue-600 font-semibold">{filteredProducts.length} items available</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
          <input
            type="text"
            placeholder="Search for products, categories, colors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all transform hover:scale-105 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <span className="mr-2 text-lg">{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-semibold text-white mb-2">No products found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={onProductBuy}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <p className="text-slate-600 text-sm font-medium">
            Showing <span className="text-blue-600 font-bold">{filteredProducts.length}</span> of <span className="text-slate-900 font-bold">{products.length}</span> products
          </p>
        </div>
      </div>
    </div>
  );
}
