import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineCash } from 'react-icons/hi'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { createOrder } from '../services/api'

export default function Checkout() {
  const { items, subtotal, clearAll } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [address, setAddress] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', pincode: ''
  })

  const deliveryFee = subtotal >= 499 ? 0 : 40
  const total = subtotal + deliveryFee

  const handleChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) return addToast('Cart is empty', 'error')

    setLoading(true)
    try {
      const orderData = {
        items: items.map(i => ({
          product: i.product?._id || i.productId,
          quantity: i.quantity,
          price: i.product?.price || 0,
        })),
        shippingAddress: address,
        paymentMethod,
        subtotal,
        deliveryFee,
        total,
      }
      const res = await createOrder(orderData)
      await clearAll()
      addToast('Order placed successfully! 🎉', 'success')
      navigate(`/orders`)
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to place order', 'error')
    }
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-display font-bold text-2xl mb-2">Nothing to checkout</h1>
        <p className="text-gray-500 mb-6">Add items to your cart first</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-bold text-3xl text-gray-900 mb-8"
      >
        Checkout
      </motion.h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <HiOutlineLocationMarker className="w-5 h-5 text-brand-600" /> Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="fullName" value={address.fullName} onChange={handleChange} required className="input-field" id="checkout-name" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" value={address.phone} onChange={handleChange} required className="input-field" id="checkout-phone" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input name="street" value={address.street} onChange={handleChange} required className="input-field" id="checkout-street" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input name="city" value={address.city} onChange={handleChange} required className="input-field" id="checkout-city" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input name="state" value={address.state} onChange={handleChange} required className="input-field" id="checkout-state" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                <input name="pincode" value={address.pincode} onChange={handleChange} required className="input-field" id="checkout-pincode" />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: 'cod', label: 'Cash on Delivery', icon: HiOutlineCash, desc: 'Pay when your order arrives' },
                { value: 'online', label: 'Online Payment', icon: HiOutlineCreditCard, desc: 'Pay via UPI, Card, or Net Banking' },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === opt.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} className="sr-only" />
                  <opt.icon className={`w-6 h-6 ${paymentMethod === opt.value ? 'text-brand-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
              {items.map(item => {
                const p = item.product || item
                return (
                  <div key={p._id || item.productId} className="flex items-center gap-2 text-sm">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <span className="font-medium">₹{p.price * item.quantity}</span>
                  </div>
                )
              })}
            </div>
            <hr className="border-gray-100 mb-3" />
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery</span><span className={deliveryFee === 0 ? 'text-brand-600 font-medium' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
              <hr className="border-gray-100" />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{total}</span></div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full" id="place-order-btn">
              {loading ? 'Placing Order...' : `Place Order — ₹${total}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
