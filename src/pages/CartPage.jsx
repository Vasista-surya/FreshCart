import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag, FiX, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, tax, deliveryCharge, discount, total, coupon, applyCoupon, removeCoupon, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const getProduct = (item) => item.product || item;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponCode.trim().toUpperCase());
    setCouponLoading(false);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="text-gray-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-accent transition-colors shadow-lg shadow-brand-primary/20">
            Start Shopping <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart ({itemCount} items)</h1>
        <button onClick={clearCart} className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1">
          <FiTrash2 size={14} /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => {
              const product = getProduct(item);
              return (
                <motion.div
                  key={product._id || item.productId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm flex gap-4"
                >
                  <Link to={`/product/${product._id}`} className="flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg bg-gray-50" onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=Item'; }} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product._id}`} className="font-semibold text-gray-800 hover:text-brand-primary line-clamp-2">{product.name}</Link>
                    {product.weight && <p className="text-sm text-gray-500 mt-0.5">{product.weight}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-brand-primary">₹{product.price}</span>
                      {product.mrp > product.price && <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(product._id || item.productId)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <FiTrash2 size={16} />
                    </button>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(product._id || item.productId, item.quantity - 1)} className="p-2 hover:bg-gray-100 transition-colors">
                        <FiMinus size={14} />
                      </button>
                      <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(product._id || item.productId, item.quantity + 1)} className="p-2 hover:bg-gray-100 transition-colors">
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-gray-800">₹{(product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <Link to="/products" className="inline-flex items-center gap-1 text-brand-primary hover:text-brand-accent font-medium text-sm mt-4">
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

            {/* Coupon */}
            <div className="mb-5">
              {coupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <FiTag className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">{coupon.code || couponCode}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-green-600 hover:text-green-800"><FiX size={16} /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                  />
                  <button onClick={handleApplyCoupon} disabled={couponLoading} className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-accent transition-colors disabled:opacity-50">
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm border-t pt-4">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax (GST 5%)</span><span>₹{tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>{deliveryCharge === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${deliveryCharge}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-3 mt-3"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>

            {deliveryCharge > 0 && (
              <p className="text-xs text-gray-500 mt-3">Add ₹{(500 - subtotal).toFixed(0)} more for free delivery</p>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full mt-5 bg-brand-primary text-white py-3.5 rounded-xl font-semibold hover:bg-brand-accent transition-colors shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
            >
              Proceed to Checkout <FiArrowRight />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
