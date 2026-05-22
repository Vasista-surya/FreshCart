import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    deliveryCharge,
    discount,
    total,
    itemCount,
    coupon,
  } = useCart();

  const getProduct = (item) => item.product || item;
  const getProductId = (item) => item.product?._id || item.productId || item._id;
  const freeDeliveryThreshold = 500;
  const remaining = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min((subtotal / freeDeliveryThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiShoppingBag className="text-brand-primary" size={20} />
                <h2 className="text-lg font-bold text-gray-900">
                  Your Cart{' '}
                  <span className="text-sm font-normal text-gray-400">
                    ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <FiShoppingBag size={40} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Looks like you haven&apos;t added anything yet
                </p>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-accent transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                {/* Free delivery bar */}
                {remaining > 0 && (
                  <div className="px-5 py-3 bg-green-50 border-b border-green-100">
                    <p className="text-xs text-green-700 font-medium mb-1.5">
                      Add ₹{remaining.toFixed(0)} more for{' '}
                      <span className="font-bold">FREE delivery</span>
                    </p>
                    <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${deliveryProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Scrollable Items */}
                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                  {items.map((item) => {
                    const prod = getProduct(item);
                    const prodId = getProductId(item);
                    const prodImage =
                      prod.image || (prod.images && prod.images[0]) || 'https://via.placeholder.com/80';
                    return (
                      <div
                        key={prodId}
                        className="flex gap-3 bg-gray-50 rounded-xl p-3"
                      >
                        <img
                          src={prodImage}
                          alt={prod.name}
                          className="w-16 h-16 object-contain rounded-lg bg-white flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                            {prod.name}
                          </h4>
                          {(prod.weight || prod.unit) && (
                            <p className="text-xs text-gray-400">
                              {prod.weight} {prod.unit}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200">
                              <button
                                onClick={() =>
                                  item.quantity <= 1
                                    ? removeFromCart(prodId)
                                    : updateQuantity(prodId, item.quantity - 1)
                                }
                                className="px-2 py-1 text-gray-500 hover:text-brand-primary transition-colors"
                              >
                                <FiMinus size={12} />
                              </button>
                              <span className="text-xs font-bold text-gray-800 min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(prodId, item.quantity + 1)}
                                className="px-2 py-1 text-gray-500 hover:text-brand-primary transition-colors"
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-bold text-gray-800">
                              ₹{((prod.price || 0) * item.quantity).toFixed(0)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(prodId)}
                          className="self-start text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom summary */}
                <div className="border-t border-gray-100 px-5 py-4 bg-white space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>GST (5%)</span>
                    <span>₹{tax.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="block w-full bg-brand-primary text-white text-center py-3 rounded-xl font-semibold hover:bg-brand-accent transition-colors mt-2"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
