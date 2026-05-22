import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiChevronRight } from 'react-icons/fi';
import { HiStar } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductById } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getItemQuantity } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await getProductById(id);
        setProduct(data.product || data);
        setRelatedProducts(data.relatedProducts || []);
        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
      setLoading(false);
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <Link to="/products" className="text-brand-primary hover:underline">Browse Products</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? [product.image, ...product.images] : [product.image];
  const discountPercent = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;
  const inCart = getItemQuantity(product._id);
  const wishlisted = isInWishlist(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-brand-primary">Home</Link>
        <FiChevronRight size={14} />
        <Link to="/products" className="hover:text-brand-primary">Products</Link>
        <FiChevronRight size={14} />
        <Link to={`/products?category=${product.category}`} className="hover:text-brand-primary">{product.category}</Link>
        <FiChevronRight size={14} />
        <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                {discountPercent}% OFF
              </span>
            )}
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-80 sm:h-96 object-contain p-8"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Product'; }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${selectedImage === idx ? 'border-brand-primary shadow-md' : 'border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          {product.brand && (
            <span className="text-sm font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
              {product.brand}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <HiStar key={star} className={`w-5 h-5 ${star <= (product.rating || 4) ? 'text-yellow-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.numReviews || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-primary">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  Save ₹{product.mrp - product.price}
                </span>
              </>
            )}
          </div>

          {/* Weight/Unit */}
          {product.weight && (
            <p className="text-gray-600">
              <span className="font-medium">Pack Size:</span> {product.weight}
            </p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock > 10 ? (
              <><span className="w-2.5 h-2.5 bg-green-500 rounded-full" /><span className="text-green-700 font-medium text-sm">In Stock</span></>
            ) : product.stock > 0 ? (
              <><span className="w-2.5 h-2.5 bg-orange-500 rounded-full" /><span className="text-orange-600 font-medium text-sm">Low Stock — Only {product.stock} left!</span></>
            ) : (
              <><span className="w-2.5 h-2.5 bg-red-500 rounded-full" /><span className="text-red-600 font-medium text-sm">Out of Stock</span></>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="px-5 font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(product, quantity)}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-brand-accent transition-colors shadow-lg shadow-brand-primary/20"
              >
                <FiShoppingCart size={20} />
                {inCart > 0 ? `Update Cart (${inCart} in cart)` : 'Add to Cart'}
              </motion.button>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={() => wishlisted ? removeFromWishlist(product._id) : addToWishlist(product)}
            className={`flex items-center gap-2 py-2.5 px-5 rounded-xl border transition-all font-medium ${wishlisted ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500'}`}
          >
            <FiHeart className={wishlisted ? 'fill-current' : ''} size={18} />
            {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
          </button>

          {/* Details */}
          <div className="border-t pt-4 space-y-2">
            <h3 className="font-semibold text-gray-800 mb-3">Product Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {product.category && <div><span className="text-gray-500">Category:</span> <span className="font-medium">{product.category}</span></div>}
              {product.brand && <div><span className="text-gray-500">Brand:</span> <span className="font-medium">{product.brand}</span></div>}
              {product.unit && <div><span className="text-gray-500">Unit:</span> <span className="font-medium">{product.unit}</span></div>}
              {product.weight && <div><span className="text-gray-500">Weight:</span> <span className="font-medium">{product.weight}</span></div>}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
