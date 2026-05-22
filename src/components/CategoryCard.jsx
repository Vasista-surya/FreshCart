import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  if (!category) return null;

  const { name, slug, icon, image, description } = category;
  const displayIcon = icon || '📦';

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => navigate(`/products?category=${slug || name?.toLowerCase()}`)}
      className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary/20 transition-colors group"
    >
      <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-brand-primary/15 transition-colors">
        {image ? (
          <img src={image} alt={name} className="w-10 h-10 object-contain" />
        ) : (
          <span className="text-3xl">{displayIcon}</span>
        )}
      </div>
      <h3 className="font-semibold text-gray-800 text-sm text-center leading-tight">
        {name}
      </h3>
      {description && (
        <p className="text-xs text-gray-400 mt-1 text-center line-clamp-1">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default CategoryCard;
