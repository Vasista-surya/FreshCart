import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiMinus, HiPlus, HiOutlineShoppingCart } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function CartSidebar({ isOpen, onClose }) {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearAll } = useCart()

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
            id="cart-sidebar"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <HiOutlineShoppingCart className="w-5 h-5 text-brand-600" />
                <h2 className="font-display font-bold text-lg">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="badge bg-brand-100 text-brand-700">{itemCount} items</span>
                )}
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" id="cart-close-btn">
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-1">Your cart is empty</h3>
                  <p className="text-sm text-gray-500 mb-6">Add some fresh groceries to get started</p>
                  <Link to="/products" onClick={onClose} className="btn-primary text-sm">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => {
                    const product = item.product || item
                    return (
                      <motion.div
                        key={product._id || item.productId}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                      >
                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                          <p className="text-xs text-gray-500">{product.weight}</p>
                          <p className="text-sm font-bold text-brand-600 mt-1">₹{product.price * item.quantity}</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200">
                            <button onClick={() => updateQuantity(product._id || item.productId, item.quantity - 1)} className="p-1.5 hover:bg-gray-50 rounded-l-lg">
                              <HiMinus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(product._id || item.productId, item.quantity + 1)} className="p-1.5 hover:bg-gray-50 rounded-r-lg">
                              <HiPlus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(product._id || item.productId)} className="text-[10px] text-red-500 hover:text-red-700">
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-lg font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={clearAll} className="btn-secondary flex-1 !text-sm !py-2.5">
                    Clear
                  </button>
                  <Link to="/checkout" onClick={onClose} className="btn-primary flex-1 !text-sm !py-2.5 text-center">
                    Checkout
                  </Link>
                </div>
                <Link to="/cart" onClick={onClose} className="block text-center text-sm text-brand-600 font-medium hover:underline">
                  View full cart →
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
