import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiShoppingBag } from 'react-icons/fi';


const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-gradient-to-br from-brand-light via-white to-brand-light px-4 py-16">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Grocery Cart Icon */}
          <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-brand-primary/10 rounded-full animate-ping duration-1000" />
            <div className="absolute inset-4 bg-brand-primary/5 rounded-full" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative z-10 text-brand-primary text-8xl"
            >
              🥦
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-gray-100/50 select-none -z-10">
              404
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3"
        >
          Oops! Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mb-8"
        >
          It seems the ingredients you are looking for aren't in our store directory. Let's get you back to shopping fresh groceries!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-accent text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-brand-primary/20 transition-all hover:shadow-xl hover:shadow-brand-primary/30"
          >
            <FiHome size={18} />
            Go to Home
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-semibold shadow-sm transition-colors"
          >
            <FiShoppingBag size={18} />
            Browse Products
          </Link>
        </motion.div>

        {/* Small brand element */}
        <p className="mt-12 text-xs text-gray-400 font-medium tracking-wide uppercase">
          Radhakrishna General Store
        </p>
      </div>
    </div>
  );
};

export default NotFound;
