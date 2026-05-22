import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategories } from '../services/api';
import { CategorySkeleton } from '../components/LoadingSkeleton';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data.categories || data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-brand-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-3 py-1 rounded-full"
          >
            Radhakrishna Store
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3"
          >
            Shop By Category
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 mt-2"
          >
            Fresh produce and high-quality household essentials delivered straight to your home.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {categories.map((cat) => (
              <motion.div
                key={cat._id || cat.slug}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 },
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center group cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <Link to={`/products?category=${cat.slug || cat.name?.toLowerCase()}`} className="absolute inset-0 z-10" />
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon || '📦'}
                </div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base group-hover:text-brand-primary transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed px-2">
                    {cat.description}
                  </p>
                )}
                <div className="mt-4 bg-brand-light px-3 py-1 rounded-full text-xs font-semibold text-gray-500 border border-gray-100 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-colors">
                  {cat.productCount || 0} items
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Categories;
