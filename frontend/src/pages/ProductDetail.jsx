import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineHeart, HiHeart, HiMinus, HiPlus, HiStar, HiArrowLeft } from 'react-icons/hi'
import { getProductById } from '../services/api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { user } = useAuth()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProductById(id)
        setProduct(res.data.product)
      } catch {
        setProduct(null)
      }
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-3xl h-96 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-lg w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="font-display font-bold text-2xl mb-2">Product not found</h2>
        <Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link>
      </div>
    )
  }

  const wishlisted = isInWishlist(product._id)
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-gray-50 rounded-3xl overflow-hidden aspect-square"
        >
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {discount > 0 && (
            <span className="absolute top-4 left-4 badge bg-red-500 text-white text-sm">{discount}% OFF</span>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="text-sm text-brand-600 font-medium mb-2">{product.category}</span>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 mb-2">{product.name}</h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
            )}
          </div>

          {product.weight && (
            <p className="text-sm text-gray-500 mb-2">Size: {product.weight}</p>
          )}

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Stock status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="badge bg-brand-100 text-brand-700">In Stock ({product.stock} available)</span>
            ) : (
              <span className="badge bg-red-100 text-red-700">Out of Stock</span>
            )}
          </div>

          {/* Quantity + Add to cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <HiMinus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => addItem(product, quantity)} className="btn-primary flex-1" id="product-add-to-cart">
                Add to Cart — ₹{product.price * quantity}
              </button>
            </div>
          )}

          {/* Wishlist */}
          {user && (
            <button
              onClick={() => wishlisted ? removeFromWishlist(product._id) : addToWishlist(product._id)}
              className="btn-secondary gap-2 w-full"
              id="product-wishlist-btn"
            >
              {wishlisted ? <HiHeart className="w-4 h-4 text-red-500" /> : <HiOutlineHeart className="w-4 h-4" />}
              {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          )}

          {/* Info */}
          <div className="mt-8 border-t border-gray-100 pt-6 space-y-3">
            {product.brand && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 w-20">Brand:</span>
                <span className="font-medium">{product.brand}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 w-20">Category:</span>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="font-medium text-brand-600 hover:underline">
                {product.category}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
