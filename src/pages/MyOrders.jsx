import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiCalendar, FiMapPin, FiCreditCard, FiChevronDown, FiChevronUp, FiCheckCircle, FiTruck, FiPackage, FiLoader } from 'react-icons/fi';
import { getOrders } from '../services/api';
import { useToast } from '../context/ToastContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      // Assume API returns array directly or inside data field
      const ordersData = res.data?.data || res.data || [];
      // Sort orders by date descending (newest first)
      ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ordersData);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch your orders. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit";
    switch (status) {
      case 'Pending':
        return `${base} bg-yellow-50 text-yellow-700 border border-yellow-200`;
      case 'Confirmed':
        return `${base} bg-blue-50 text-blue-700 border border-blue-200`;
      case 'Packed':
        return `${base} bg-indigo-50 text-indigo-700 border border-indigo-200`;
      case 'Shipped':
        return `${base} bg-purple-50 text-purple-700 border border-purple-200`;
      case 'Delivered':
        return `${base} bg-emerald-50 text-emerald-700 border border-emerald-200`;
      case 'Cancelled':
        return `${base} bg-rose-50 text-rose-700 border border-rose-200`;
      default:
        return `${base} bg-gray-50 text-gray-700 border border-gray-200`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FiLoader className="animate-spin text-yellow-600" size={12} />;
      case 'Confirmed':
        return <FiCheckCircle className="text-blue-600" size={12} />;
      case 'Packed':
        return <FiPackage className="text-indigo-600" size={12} />;
      case 'Shipped':
        return <FiTruck className="text-purple-600" size={12} />;
      case 'Delivered':
        return <FiCheckCircle className="text-emerald-600" size={12} />;
      default:
        return null;
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
            <FiShoppingBag size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            You haven't placed any orders with Radhakrishna General Store yet. Check out our fresh grocery items!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-accent transition-all shadow-lg shadow-brand-primary/20 hover:shadow-xl"
          >
            Browse Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">Track and view invoices for all your Radhakrishna General Store orders.</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;
          const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <motion.div
              key={order._id}
              layout
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Order Header Summary */}
              <div className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => toggleExpand(order._id)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-500">Order ID: #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <FiCalendar size={14} />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-gray-400 block">Total Amount</span>
                      <span className="text-lg font-bold text-brand-primary">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-light rounded-xl transition-all">
                      {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Micro Images Preview (when collapsed) */}
                {!isExpanded && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                    <div className="flex -space-x-3 overflow-hidden">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-contain bg-gray-50 border border-gray-100"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=Item'; }}
                        />
                      ))}
                    </div>
                    {order.items.length > 4 && (
                      <span className="text-xs text-gray-500 font-medium">+{order.items.length - 4} more item{order.items.length - 4 > 1 ? 's' : ''}</span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">Click to view items and address details</span>
                  </div>
                )}
              </div>

              {/* Order Full Details (Expanded) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-100 bg-gray-50/30 overflow-hidden"
                  >
                    <div className="p-6 space-y-6">
                      {/* Products List */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
                        <div className="space-y-3 bg-white rounded-xl border border-gray-100 p-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0 last:pb-0 first:pt-0">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-100"
                                  onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=Item'; }}
                                />
                                <div>
                                  <h5 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h5>
                                  <p className="text-xs text-gray-500">{item.weight || item.unit} &bull; Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Info Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Delivery Details */}
                        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                            <FiMapPin className="text-brand-primary" size={16} /> Delivery Address
                          </h4>
                          {order.shippingAddress ? (
                            <div className="text-xs text-gray-600 space-y-1">
                              <p className="font-bold text-gray-800">{order.shippingAddress.name}</p>
                              <p>{order.shippingAddress.street}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                              <p className="pt-1 text-gray-500">Phone: {order.shippingAddress.phone}</p>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">No shipping address recorded</p>
                          )}
                        </div>

                        {/* Payment & Invoice Summary */}
                        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                            <FiCreditCard className="text-brand-primary" size={16} /> Payment & Billing
                          </h4>
                          <div className="text-xs text-gray-600 space-y-2">
                            <div className="flex justify-between">
                              <span>Payment Method:</span>
                              <span className="font-bold text-gray-800">{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Payment Status:</span>
                              <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{order.paymentStatus}</span>
                            </div>
                            {order.couponCode && (
                              <div className="flex justify-between text-brand-primary">
                                <span>Coupon Applied:</span>
                                <span className="font-bold">{order.couponCode}</span>
                              </div>
                            )}

                            <div className="pt-2 border-t border-gray-100 space-y-1">
                              <div className="flex justify-between text-gray-500">
                                <span>Subtotal:</span>
                                <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-emerald-600 font-medium">
                                  <span>Discount:</span>
                                  <span>-₹{order.discount.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-gray-500">
                                <span>Tax (GST 5%):</span>
                                <span>₹{order.tax?.toFixed(2) || '0.00'}</span>
                              </div>
                              <div className="flex justify-between text-gray-500">
                                <span>Delivery Charge:</span>
                                <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge?.toFixed(2)}`}</span>
                              </div>
                              <div className="flex justify-between text-sm font-extrabold text-gray-800 pt-1 border-t border-dashed border-gray-100">
                                <span>Grand Total:</span>
                                <span className="text-brand-primary">₹{order.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar visual indicator */}
                      <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Delivery Progress</h4>
                        <div className="flex items-center justify-between relative">
                          {/* Progress Line background */}
                          <div className="absolute left-0 right-0 h-1 bg-gray-100 top-1/2 -translate-y-1/2 -z-10 rounded-full" />
                          {/* Progress Active line overlay */}
                          <div
                            className="absolute left-0 h-1 bg-brand-primary top-1/2 -translate-y-1/2 -z-10 rounded-full transition-all duration-500"
                            style={{
                              width:
                                order.orderStatus === 'Cancelled' ? '100%' :
                                order.orderStatus === 'Pending' ? '10%' :
                                order.orderStatus === 'Confirmed' ? '30%' :
                                order.orderStatus === 'Packed' ? '50%' :
                                order.orderStatus === 'Shipped' ? '75%' : '100%'
                            }}
                          />

                          {order.orderStatus === 'Cancelled' ? (
                            <div className="w-full text-center text-xs font-semibold text-red-500">
                              This order has been cancelled.
                            </div>
                          ) : (
                            ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => {
                              const steps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
                              const currentIdx = steps.indexOf(order.orderStatus);
                              const isCompleted = currentIdx >= idx;
                              const isActive = currentIdx === idx;

                              return (
                                <div key={step} className="flex flex-col items-center gap-1.5">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                                      isCompleted
                                        ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20'
                                        : 'bg-white border-gray-200 text-gray-400'
                                    } ${isActive ? 'scale-110 ring-4 ring-brand-primary/10' : ''}`}
                                  >
                                    {isCompleted ? '✓' : idx + 1}
                                  </div>
                                  <span className={`text-[10px] sm:text-xs font-semibold ${isCompleted ? 'text-brand-primary' : 'text-gray-400'}`}>{step}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
