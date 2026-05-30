import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/products?category=${encodeURIComponent(category.name)}`}
        className="block group text-center"
        id={`category-card-${category.slug}`}
      >
        <div className="relative w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl flex items-center justify-center group-hover:from-brand-100 group-hover:to-brand-200 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-brand-200/50">
          <span className="text-3xl">{category.icon}</span>
        </div>
        <h3 className="text-xs font-semibold text-gray-700 group-hover:text-brand-600 transition-colors line-clamp-2">
          {category.name}
        </h3>
        {category.productCount > 0 && (
          <p className="text-[10px] text-gray-400 mt-0.5">{category.productCount} items</p>
        )}
      </Link>
    </motion.div>
  )
}
