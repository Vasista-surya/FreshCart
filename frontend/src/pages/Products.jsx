import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiAdjustments, HiSearch } from 'react-icons/hi'
import ProductCard from '../components/ui/ProductCard'
import { getProducts, getCategories } from '../services/api'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('name')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  const activeCategory = searchParams.get('category') || ''

  useEffect(() => {
    getCategories().then(res => setCategories(res.data.categories || [])).catch(() => {})
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = {}
        if (activeCategory) params.category = activeCategory
        if (searchQuery) params.search = searchQuery
        if (sortBy) params.sort = sortBy
        const res = await getProducts(params)
        setProducts(res.data.products || [])
      } catch {
        setProducts([])
      }
      setLoading(false)
    }
    fetchProducts()
  }, [activeCategory, sortBy, searchQuery])

  const handleCategoryFilter = (cat) => {
    const params = new URLSearchParams(searchParams)
    if (cat) params.set('category', cat)
    else params.delete('category')
    params.delete('search')
    setSearchQuery('')
    setSearchParams(params)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set('search', searchQuery.trim())
      setSearchParams(params)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display font-bold text-3xl text-gray-900">
          {activeCategory || 'All Products'}
        </h1>
        <p className="text-gray-500 mt-1">
          {products.length} products {activeCategory ? `in ${activeCategory}` : 'available'}
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="input-field !pl-10 !text-sm"
                id="products-search"
              />
            </div>
          </form>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
              <HiAdjustments className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryFilter('')}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !activeCategory ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id || cat.slug}
                  onClick={() => handleCategoryFilter(cat.name)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat.name ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>{cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-3">Sort By</h3>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="input-field !text-sm"
              id="products-sort"
            >
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
              <option value="price">Price (Low to High)</option>
              <option value="-price">Price (High to Low)</option>
              <option value="-rating">Highest Rated</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
