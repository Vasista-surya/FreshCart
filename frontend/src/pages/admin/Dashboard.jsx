import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineCube, HiOutlineClipboardList, HiOutlineUserGroup, HiOutlineCurrencyRupee } from 'react-icons/hi'
import { getDashboard } from '../../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(res => {
      setStats(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Total Products', value: stats.totalProducts || 0, icon: HiOutlineCube, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: HiOutlineClipboardList, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Users', value: stats.totalUsers || 0, icon: HiOutlineUserGroup, color: 'bg-purple-50 text-purple-600' },
    { label: 'Revenue', value: `₹${stats.totalRevenue || 0}`, icon: HiOutlineCurrencyRupee, color: 'bg-brand-50 text-brand-600' },
  ] : []

  return (
    <div>
      <h2 className="font-display font-semibold text-xl mb-6">Dashboard Overview</h2>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-5"
              >
                <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent orders */}
          {stats?.recentOrders?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Order ID</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Customer</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.slice(0, 5).map(order => (
                      <tr key={order._id} className="border-b border-gray-50">
                        <td className="py-2.5 px-3 font-mono text-xs">#{order._id?.slice(-6)}</td>
                        <td className="py-2.5 px-3">{order.user?.name || 'Unknown'}</td>
                        <td className="py-2.5 px-3">
                          <span className={`badge ${
                            order.status === 'delivered' ? 'bg-brand-100 text-brand-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium">₹{order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
