import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiHeart, FiCheck, FiShoppingBag } from 'react-icons/fi';

const About = () => {
  return (
    <div className="min-h-screen bg-brand-light">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-800 to-brand-primary text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-secondary text-brand-dark text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm"
          >
            Since 1998
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 leading-tight"
          >
            Radhakrishna General Store
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto mt-4 leading-relaxed font-light"
          >
            Your trusted neighbourhood shop, now serving you digitally with superfast 30-minute delivery!
          </motion.p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <h2 className="text-3xl font-extrabold text-brand-dark">
              Our Journey & Purpose
            </h2>
            <p className="text-gray-600 leading-relaxed">
              For over two decades, Radhakrishna General Store has been a cornerstone of our community. We started with a simple vision: to provide the freshest groceries, daily dairy, and essential household items with unmatched personal service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              As technology evolves, our mission remains the same but with added convenience. We have launched our digital platform to let you order from the safety of your home, ensuring the exact same trust and quality, delivered in 30 minutes!
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                to="/products"
                className="bg-brand-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-accent transition-colors shadow-lg shadow-brand-primary/20"
              >
                Shop Now
              </Link>
              <Link
                to="/categories"
                className="bg-white border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=450&fit=crop"
              alt="Grocery selection"
              className="rounded-2xl shadow-xl w-full object-cover h-[350px] border border-gray-100"
            />
            <div className="absolute -bottom-6 -left-6 bg-brand-secondary text-brand-dark p-6 rounded-2xl shadow-lg max-w-[200px] border-4 border-white flex flex-col gap-1 items-center text-center">
              <span className="text-3xl font-black">100%</span>
              <span className="text-xs font-bold uppercase tracking-wider">Fresh & Organic</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Pillars */}
      <div className="bg-white py-16 border-t border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark text-center mb-12">
            Why Shop With Radhakrishna?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <FiClock className="text-brand-primary" size={24} />,
                title: '30 Min Delivery',
                desc: 'Locally optimized route dispatch ensures your groceries arrive within half an hour.',
              },
              {
                icon: <FiHeart className="text-brand-primary" size={24} />,
                title: 'Trusted Quality',
                desc: 'Handpicked fresh items, certified brands, and safe packaging standards.',
              },
              {
                icon: <FiCheck className="text-brand-primary" size={24} />,
                title: 'Best Daily Rates',
                desc: 'Fair market pricing with sweet discounts, deals, and daily promo codes.',
              },
              {
                icon: <FiShoppingBag className="text-brand-primary" size={24} />,
                title: 'Wide Catalog',
                desc: 'Rice, dals, dairy, bread, cleaning, and baby care—we stock everything you need.',
              },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-brand-light border border-gray-100 flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  {pillar.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{pillar.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
