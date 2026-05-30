import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CategoryCard from '../ui/CategoryCard'
import { getCategories } from '../../services/api'

export default function CategoryShowcase() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCategories()
        setCategories(res.data.categories || [])
      } catch {
        setCategories([])
      }
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-20 h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="category-showcase">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display font-bold text-2xl md:text-3xl text-gray-900 mb-8 text-center"
      >
        Shop by Category
      </motion.h2>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={category._id || category.slug} category={category} index={index} />
        ))}
      </div>
    </section>
  )
}
