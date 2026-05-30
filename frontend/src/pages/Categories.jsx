import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCategories } from '../services/api'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(res => {
      setCategories(res.data.categories || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">All Categories</h1>
        <p className="text-gray-500 mb-8">Browse our wide range of grocery categories</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id || cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="block group card overflow-hidden"
                id={`category-page-${cat.slug}`}
              >
                <div className="relative h-36 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center group-hover:from-brand-100 group-hover:to-brand-200 transition-all">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                  {cat.productCount > 0 && (
                    <p className="text-xs text-brand-600 font-medium mt-2">{cat.productCount} products</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
