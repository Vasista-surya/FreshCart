import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiMapPin, FiClock, FiShoppingBag, FiTruck } from 'react-icons/fi';
import * as api from '../services/api';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.getOrderById(id);
        setOrder(data.order || data);
      } catch (err) {
        console.error('Failed to load order info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-brand-light">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-semibold">Loading Confirmation details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Confirmation Mismatch</h2>
        <p className="text-gray-500 mb-8">We couldn't retrieve the specified order details.</p>
        <Link to="/" className="text-brand-primary font-semibold hover:underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          {/* Top Banner with Success Checkmark */}
          <div className="bg-gradient-to-br from-green-700 to-brand-primary text-white text-center py-10 px-6 relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-full mb-4"
            >
              <FiCheckCircle size={44} className="text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-black">Order Confirmed!</h1>
            <p className="text-green-100 text-sm mt-1 font-light">
              Thank you for shopping with Radhakrishna General Store
            </p>
            <div className="mt-4 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 inline-flex items-center gap-2 border border-white/10">
              <span className="text-xs uppercase font-bold tracking-wider text-green-200">Order ID:</span>
              <span className="text-xs font-black font-mono">{order._id || order.id}</span>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Delivery Alert Card */}
            <div className="bg-gradient-to-r from-green-50 to-brand-light border border-green-100 rounded-2xl p-5 flex gap-4 items-center">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-primary flex-shrink-0">
                <FiTruck size={24} className="animate-bounce" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-800 text-sm sm:text-base flex items-center gap-1.5">
                  Arriving in 30 minutes! <FiClock className="text-brand-primary" />
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-normal">
                  Our delivery executive is packaging your items and will depart shortly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {/* Delivery Address Details */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <FiMapPin className="text-brand-primary" /> Delivery Destination
                </h3>
                <div className="border border-gray-100 bg-brand-light/50 p-4 rounded-2xl space-y-1">
                  <p className="font-bold text-gray-800 text-xs">{order.shippingAddress?.name}</p>
                  <p className="text-xs text-gray-400">{order.shippingAddress?.phone}</p>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                    <span className="font-bold">{order.shippingAddress?.pincode}</span>
                  </p>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <FiPackage className="text-brand-primary" /> Transaction Details
                </h3>
                <div className="border border-gray-100 bg-brand-light/50 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Mode:</span>
                    <span className="font-bold text-gray-700">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Status:</span>
                    <span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full border ${
                      order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between text-sm font-extrabold text-gray-800">
                    <span>Amount Paid:</span>
                    <span className="text-brand-primary">₹{order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* List of Ordered Items */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Items Summary</h3>
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center justify-between text-xs py-2 border-b border-gray-50 last:border-b-0">
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-12 object-contain rounded bg-gray-50 border p-1"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50x50?text=Item';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-gray-400 mt-0.5">
                        {item.quantity} x ₹{item.price} {item.weight ? `(${item.weight})` : ''}
                      </p>
                    </div>
                    <span className="font-bold text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/orders"
                className="flex-1 text-center bg-brand-primary text-white py-3.5 rounded-xl font-bold hover:bg-brand-accent transition-colors shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 text-sm"
              >
                Track In My Orders
              </Link>
              <Link
                to="/products"
                className="flex-1 text-center bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <FiShoppingBag /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
