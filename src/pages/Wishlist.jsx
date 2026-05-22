import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, getItemQuantity } = useCart();

  const getProduct = (item) => item.product || item;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiHeart className="text-gray-300" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Explore our catalog and add fresh produce and daily essentials to your favorites.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-brand-accent transition-colors shadow-lg shadow-brand-primary/20"
          >
            Find Grocery Essentials <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          My Favorite Essentials ({items.length})
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Keep track of your regular items for quick re-ordering
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {items.map((item) => {
            const product = getProduct(item);
            if (!product) return null;
            const inCart = getItemQuantity(product._id);
            const isOutOfStock = product.stock === 0;

            return (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div className="relative group mb-3">
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-1 right-1 z-10 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm"
                    title="Remove from Wishlist"
                  >
                    <FiTrash2 size={14} />
                  </button>

                  <Link to={`/products/${product._id}`} className="block">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-contain rounded-xl p-3 bg-gray-50"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200?text=Item';
                      }}
                    />
                  </Link>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {product.brand && (
                      <span className="text-[10px] uppercase font-bold text-brand-primary/80 tracking-wider">
                        {product.brand}
                      </span>
                    )}
                    <Link
                      to={`/products/${product._id}`}
                      className="block font-bold text-gray-800 hover:text-brand-primary text-sm sm:text-base line-clamp-2 mt-0.5"
                    >
                      {product.name}
                    </Link>
                    {product.weight && (
                      <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                        {product.weight}
                      </span>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base font-extrabold text-brand-primary">
                        ₹{product.price}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.mrp}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50">
                    {isOutOfStock ? (
                      <span className="w-full inline-flex items-center justify-center bg-red-50 text-red-600 text-xs font-semibold py-2 rounded-xl border border-red-100">
                        Out of Stock
                      </span>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => addToCart(product, 1)}
                        className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          inCart > 0
                            ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20'
                            : 'bg-brand-primary text-white hover:bg-brand-accent shadow-brand-primary/10'
                        }`}
                      >
                        <FiShoppingCart size={13} />
                        {inCart > 0 ? `In Cart (${inCart})` : 'Add to Cart'}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;
