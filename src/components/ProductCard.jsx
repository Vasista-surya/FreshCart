import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, getItemQuantity, removeFromCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!product) return null;

  const {
    _id,
    name,
    price = 0,
    mrp = 0,
    image,
    images,
    unit = '',
    weight = '',
    brand = '',
    stock = 0,
    isAvailable = true,
  } = product;

  const productImage = image || (images && images[0]) || 'https://via.placeholder.com/300x300?text=No+Image';
  const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const isLowStock = stock > 0 && stock < 10;
  const isOutOfStock = stock <= 0 || !isAvailable;
  const wishlisted = isInWishlist(_id);
  const qtyInCart = getItemQuantity(_id);

  const handleCardClick = (e) => {
    // Don't navigate if clicking buttons
    if (e.target.closest('button') || e.target.closest('.qty-control')) return;
    navigate(`/product/${_id}`);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(_id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer group ${
        isOutOfStock ? 'opacity-60' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Discount badge */}
      {discountPercent > 0 && !isOutOfStock && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          {discountPercent}% OFF
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
      >
        <FiHeart
          size={16}
          className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
        />
      </button>

      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={productImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop';
          }}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 pb-4">
        {brand && (
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">
            {brand}
          </p>
        )}
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-1 min-h-[2.5rem]">
          {name}
        </h3>
        {(weight || unit) && (
          <p className="text-xs text-gray-400 mb-2">
            {weight} {unit}
          </p>
        )}

        {/* Stock indicator */}
        {!isOutOfStock && (
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLowStock ? 'bg-orange-400' : 'bg-green-500'
              }`}
            />
            <span className={`text-[10px] font-medium ${isLowStock ? 'text-orange-500' : 'text-green-600'}`}>
              {isLowStock ? `Only ${stock} left` : 'In Stock'}
            </span>
          </div>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-brand-primary">₹{price}</span>
            {mrp > price && (
              <span className="text-xs text-gray-400 line-through">₹{mrp}</span>
            )}
          </div>

          {!isOutOfStock && (
            <div className="qty-control">
              {qtyInCart === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="bg-brand-primary/10 text-brand-primary text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-brand-primary hover:text-white transition-colors"
                >
                  ADD
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-brand-primary rounded-lg overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (qtyInCart <= 1) removeFromCart(_id);
                      else updateQuantity(_id, qtyInCart - 1);
                    }}
                    className="text-white px-2 py-1.5 hover:bg-brand-primary/80 transition-colors"
                  >
                    <FiMinus size={12} />
                  </button>
                  <span className="text-white text-xs font-bold min-w-[20px] text-center">
                    {qtyInCart}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(_id, qtyInCart + 1);
                    }}
                    className="text-white px-2 py-1.5 hover:bg-brand-primary/80 transition-colors"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
