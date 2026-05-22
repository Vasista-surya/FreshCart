import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const FloatingCartButton = ({ onClick }) => {
  const { itemCount, total } = useCart();
  const location = useLocation();

  // Hide on cart, checkout, and admin pages
  const hiddenPaths = ['/cart', '/checkout', '/admin'];
  const shouldHide =
    itemCount === 0 ||
    hiddenPaths.some((p) => location.pathname.startsWith(p));

  return (
    <AnimatePresence>
      {!shouldHide && (
        <motion.button
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={onClick}
          className="fixed bottom-6 right-6 z-50 bg-brand-primary text-white rounded-full shadow-xl shadow-brand-primary/30 flex items-center gap-3 px-5 py-3.5 hover:bg-brand-accent transition-colors md:bottom-8 md:right-8"
        >
          <div className="relative">
            <HiOutlineShoppingBag size={22} />
            <motion.span
              key={itemCount}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
              className="absolute -top-2 -right-2 bg-brand-secondary text-brand-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
            >
              {itemCount}
            </motion.span>
          </div>
          <div className="border-l border-white/30 pl-3">
            <span className="text-sm font-bold">₹{total.toFixed(0)}</span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartButton;
