'use client';

import React, { useState, useEffect } from 'react';
import { Receipt, Package, Clock, CurrencyDollar } from '@phosphor-icons/react';

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_amount: number;
  line_total: number;
  currency: string;
  size?: string;
}

interface Order {
  id: string;
  status: string;
  line_items: OrderItem[];
  total_amount: number;
  currency: string;
  created_at: string;
  buyer: {
    name: string;
    email?: string;
  };
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    average_order_value: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      // Try to fetch from API, fallback to reading orders.json
      const response = await fetch('http://localhost:8000/acp/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.log('API not available, using static data');
      // Fallback: orders will be empty until API is running
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/acp/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.log('Stats API not available');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with Stats */}
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Receipt size={28} weight="bold" />
          Order History
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 hover:border-blue-400 transition-all shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 text-sm mb-2 font-medium">
              <Package size={18} weight="bold" />
              Total Orders
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {stats.total_orders}
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 hover:border-indigo-400 transition-all shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600 text-sm mb-2 font-medium">
              <CurrencyDollar size={18} weight="bold" />
              Total Spent
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              ₹{stats.total_revenue}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-slate-400 transition-all shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 text-sm mb-2 font-medium">
              <Clock size={18} weight="bold" />
              Avg Order
            </div>
            <div className="text-3xl font-bold text-slate-700">
              ₹{stats.average_order_value}
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {orders.length === 0 ? (
          <div className="text-center text-slate-500 py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-200 flex items-center justify-center">
              <Package size={48} className="text-slate-400" />
            </div>
            <p className="text-xl font-semibold text-slate-900 mb-2">No orders yet</p>
            <p>Start shopping to see your order history here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice().reverse().map((order) => (
              <div
                key={order.id}
                className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/10"
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
                      <Receipt size={20} weight="fill" className="text-blue-600" />
                      Order #{order.id}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">📅 {formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      ₹{order.total_amount}
                    </div>
                    <span className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-bold ${
                      order.status === 'CONFIRMED' 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    }`}>
                      ✓ {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items Summary */}
                <div className="flex items-center gap-3 text-slate-700 text-sm bg-slate-50 rounded-lg px-4 py-2 border border-slate-200">
                  <Package size={18} weight="bold" className="text-blue-600" />
                  <span className="font-medium">{order.line_items.length} item(s)</span>
                  <span className="text-slate-400">•</span>
                  <span>👤 {order.buyer.name}</span>
                </div>

                {/* Expanded Details */}
                {selectedOrder?.id === order.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                    <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">Order Items</p>
                    {order.line_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                        <span className="text-slate-700 font-medium">
                          {item.product_name} 
                          <span className="text-slate-500 ml-2">×{item.quantity}</span>
                          {item.size && <span className="text-blue-600 ml-2 text-xs">({item.size})</span>}
                        </span>
                        <span className="text-slate-900 font-bold">₹{item.line_total}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
