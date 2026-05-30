import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineClock, HiOutlineTruck, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi'
import { getOrders } from '../services/api'

const statusConfig = {
  pending: { color: 'bg-amber-100 text-amber-700', icon: HiOutlineClock, label: 'Pending' },
  processing: { color: 'bg-blue-100 text-blue-700', icon: HiOutlineTruck, label: 'Processing' },
  shipped: { color: 'bg-indigo-100 text-indigo-700', icon: HiOutlineTruck, label: 'Shipped' },
  delivered: { color: 'bg-brand-100 text-brand-700', icon: HiOutlineCheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: HiOutlineXCircle, label: 'Cancelled' },
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders().then(res => {
      setOrders(res.data.orders || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-32 mb-4 animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-bold text-3xl text-gray-900 mb-8"
      >
        My Orders
      </motion.h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="font-display font-semibold text-xl text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const status = statusConfig[order.status] || statusConfig.pending
            const StatusIcon = status.icon
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Order #{order._id?.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <span className={`badge ${status.color} flex items-center gap-1`}>
                    <StatusIcon className="w-3.5 h-3.5" /> {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {order.items?.map((item, j) => (
                    <img key={j} src={item.product?.image || ''} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                  ))}
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-1">{order.items?.length} items</span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                  <span className="font-bold text-gray-900">₹{order.total}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
