import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  {
    emoji: '🥬',
    title: 'Fresh Vegetables & Fruits',
    subtitle: 'Up to 40% OFF',
    gradient: 'from-emerald-500 to-green-600',
    bgLight: 'bg-green-50',
  },
  {
    emoji: '🚚',
    title: 'Free Delivery',
    subtitle: 'On orders above ₹500',
    gradient: 'from-cyan-500 to-teal-600',
    bgLight: 'bg-cyan-50',
  },
  {
    emoji: '🎉',
    title: 'Welcome Offer!',
    subtitle: 'Use code WELCOME10 for 10% off',
    gradient: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
  },
];

const OfferBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl h-32 sm:h-36 md:h-40">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 bg-gradient-to-r ${banners[currentIndex].gradient} rounded-2xl flex items-center justify-center px-8`}
        >
          <div className="text-center text-white">
            <span className="text-4xl md:text-5xl block mb-2">
              {banners[currentIndex].emoji}
            </span>
            <h3 className="text-xl md:text-2xl font-bold mb-1">
              {banners[currentIndex].title}
            </h3>
            <p className="text-sm md:text-base text-white/90 font-medium">
              {banners[currentIndex].subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default OfferBanner;
