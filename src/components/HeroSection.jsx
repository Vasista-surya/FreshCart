import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const floatingEmojis = ['🥕', '🍎', '🥬', '🍋', '🥛', '🍞', '🧅', '🍌'];

const FloatingEmoji = ({ emoji, delay }) => {
  const randomX = Math.random() * 100;
  return (
    <motion.span
      className="absolute text-2xl pointer-events-none opacity-40"
      style={{ left: `${randomX}%`, bottom: 0 }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: -300,
        opacity: [0, 0.6, 0.4, 0],
        x: [0, Math.random() * 40 - 20],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay: delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      {emoji}
    </motion.span>
  );
};

const HeroSection = () => {
  const [currentTag, setCurrentTag] = useState(0);
  const tags = ['Fresh Vegetables', 'Organic Fruits', 'Daily Essentials', 'Dairy Products'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTag((prev) => (prev + 1) % tags.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [tags.length]);

  return (
    <div className="relative bg-gradient-to-br from-brand-light via-white to-green-50 overflow-hidden">
      {/* Floating emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingEmojis.map((emoji, i) => (
          <FloatingEmoji key={i} emoji={emoji} delay={i * 0.8} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[85vh] py-20 lg:py-0">
          {/* Left Content */}
          <div className="relative z-10 text-center lg:text-left">
            {/* Delivery badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full border border-green-100 mb-6"
            >
              <span className="text-lg">🚀</span>
              Delivery in 30 minutes
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-dark leading-tight"
            >
              Fresh groceries
              <br />
              <span className="text-brand-primary">delivered</span> to{' '}
              <span className="relative">
                your door
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 8C50 2 150 2 198 8"
                    stroke="#fbbf24"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 text-base md:text-lg text-gray-500 max-w-lg mx-auto lg:mx-0"
            >
              Premium quality fruits, vegetables, dairy, and household essentials from{' '}
              <span className="font-semibold text-gray-700">Radhakrishna General Store</span>.
            </motion.p>

            {/* Rotating tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center gap-2 justify-center lg:justify-start"
            >
              <span className="text-sm text-gray-400">Popular:</span>
              <motion.span
                key={currentTag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full"
              >
                {tags[currentTag]}
              </motion.span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-primary text-white font-semibold rounded-full hover:bg-brand-accent transition-colors shadow-lg shadow-brand-primary/25"
              >
                Shop Now
                <FiArrowRight size={18} />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-primary/10 text-brand-primary font-semibold rounded-full hover:bg-brand-primary/20 transition-colors"
              >
                Browse Categories
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex items-center gap-8 justify-center lg:justify-start"
            >
              {[
                { value: '1000+', label: 'Products' },
                { value: '30min', label: 'Delivery' },
                { value: '4.8★', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-bold text-brand-dark">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Decorative blobs */}
              <div className="absolute -top-8 -left-8 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -right-8 w-56 h-56 bg-brand-secondary/20 rounded-full blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Fresh organic vegetables and fruits"
                className="relative z-10 w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              {/* Floating offer card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 z-20 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-brand-secondary/20 rounded-xl flex items-center justify-center text-2xl">
                  🎉
                </div>
                <div>
                  <p className="text-xs text-gray-400">First Order</p>
                  <p className="text-sm font-bold text-brand-dark">10% OFF</p>
                </div>
              </motion.div>
              {/* Floating freshness card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -top-2 -right-2 z-20 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2"
              >
                <span className="text-2xl">🌿</span>
                <div>
                  <p className="text-xs font-bold text-green-600">100% Fresh</p>
                  <p className="text-[10px] text-gray-400">Farm to doorstep</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
