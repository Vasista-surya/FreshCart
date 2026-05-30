import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineHeart, HiHeart, HiPlus } from 'react-icons/hi'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { user } = useAuth()
  const wishlisted = isInWishlist(product._id)

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card group overflow-hidden"
      id={`product-card-${product._id}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge bg-red-500 text-white">{discount}% OFF</span>
          )}
          {product.isFeatured && (
            <span className="badge bg-accent-500 text-white">Featured</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-gray-800 text-white">Out of Stock</span>
          )}
        </div>

        {/* Wishlist */}
        {user && (
          <button
            onClick={() => wishlisted ? removeFromWishlist(product._id) : addToWishlist(product._id)}
            className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all"
            id={`wishlist-btn-${product._id}`}
          >
            {wishlisted
              ? <HiHeart className="w-4 h-4 text-red-500" />
              : <HiOutlineHeart className="w-4 h-4 text-gray-600" />
            }
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <Link to={`/product/${product._id}`}>
          <p className="text-xs text-brand-600 font-medium mb-1">{product.category}</p>
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1.5 group-hover:text-brand-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.weight && (
          <p className="text-xs text-gray-400 mb-2">{product.weight}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
            )}
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-600/20 hover:shadow-lg hover:-translate-y-0.5'
            }`}
            id={`add-to-cart-${product._id}`}
          >
            <HiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
