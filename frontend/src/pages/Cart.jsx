import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMinus, HiPlus, HiTrash, HiArrowRight } from 'react-icons/hi'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearAll } = useCart()
  const deliveryFee = subtotal >= 499 ? 0 : 40
  const total = subtotal + deliveryFee

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Browse our products and add some items to your cart</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-bold text-3xl text-gray-900 mb-8"
      >
        Shopping Cart <span className="text-lg font-normal text-gray-500">({itemCount} items)</span>
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => {
            const product = item.product || item
            return (
              <motion.div
                key={product._id || item.productId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-4 flex items-center gap-4"
              >
                <Link to={`/product/${product._id}`}>
                  <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product._id}`} className="font-medium text-gray-900 hover:text-brand-600 line-clamp-1">{product.name}</Link>
                  <p className="text-xs text-gray-500 mt-0.5">{product.weight} • {product.category}</p>
                  <p className="text-sm font-bold text-brand-600 mt-1">₹{product.price}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-1">
                  <button onClick={() => updateQuantity(product._id || item.productId, item.quantity - 1)} className="p-2 hover:bg-gray-200 rounded-lg"><HiMinus className="w-3 h-3" /></button>
                  <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(product._id || item.productId, item.quantity + 1)} className="p-2 hover:bg-gray-200 rounded-lg"><HiPlus className="w-3 h-3" /></button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{product.price * item.quantity}</p>
                  <button onClick={() => removeItem(product._id || item.productId)} className="text-xs text-red-500 hover:text-red-700 mt-1"><HiTrash className="w-3.5 h-3.5 inline" /> Remove</button>
                </div>
              </motion.div>
            )
          })}
          <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear entire cart</button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium">₹{subtotal}</span></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className={`font-medium ${deliveryFee === 0 ? 'text-brand-600' : ''}`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-gray-400">Free delivery on orders above ₹499</p>
              )}
              <hr className="border-gray-100" />
              <div className="flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-lg">₹{total}</span></div>
            </div>
            <Link to="/checkout" className="btn-primary w-full gap-2">
              Proceed to Checkout <HiArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products" className="block text-center text-sm text-brand-600 font-medium mt-3 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
