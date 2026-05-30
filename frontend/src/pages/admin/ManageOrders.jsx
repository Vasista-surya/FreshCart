import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAdminOrders, updateOrderStatus } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrders()
      setOrders(res.data.orders || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status)
      addToast(`Order status updated to ${status}`, 'success')
      fetchOrders()
    } catch {
      addToast('Failed to update status', 'error')
    }
  }

  return (
    <div>
      <h2 className="font-display font-semibold text-xl mb-6">Manage Orders</h2>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No orders yet</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-xs text-gray-500">#{order._id?.slice(-8).toUpperCase()}</p>
                  <p className="font-medium text-gray-900 mt-0.5">{order.user?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    className="input-field !text-xs !py-1.5 !px-3 !w-auto"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                  <span className="font-bold text-gray-900">₹{order.total}</span>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {order.items?.map((item, j) => (
                  <div key={j} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1.5 flex-shrink-0">
                    <img src={item.product?.image} alt="" className="w-8 h-8 rounded object-cover" />
                    <div className="text-xs">
                      <p className="font-medium truncate max-w-[120px]">{item.product?.name}</p>
                      <p className="text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
