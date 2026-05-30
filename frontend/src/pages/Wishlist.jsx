import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiOutlineHeart, HiTrash } from 'react-icons/hi'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

export default function Wishlist() {
  const { items, removeFromWishlist, loading } = useWishlist()
  const { addItem } = useCart()

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl text-gray-900 mb-2 flex items-center gap-2">
          <HiOutlineHeart className="w-8 h-8 text-red-400" /> My Wishlist
        </h1>
        <p className="text-gray-500 mb-8">{items.length} items saved</p>
      </motion.div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="font-display font-semibold text-xl mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love for later</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const product = item.product || item
            return (
              <motion.div
                key={product._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <Link to={`/product/${product._id}`}>
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 line-clamp-1 hover:text-brand-600">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-lg">₹{product.price}</span>
                    <div className="flex gap-2">
                      <button onClick={() => { addItem(product); removeFromWishlist(product._id) }} className="btn-primary !text-xs !py-2 !px-3">
                        Add to Cart
                      </button>
                      <button onClick={() => removeFromWishlist(product._id)} className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors">
                        <HiTrash className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
