import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import HeroSection from '../components/HeroSection';
import OfferBanner from '../components/OfferBanner';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { ProductCardSkeleton, CategorySkeleton } from '../components/LoadingSkeleton';
import { getCategories, getFeaturedProducts, getProducts } from '../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [essentials, setEssentials] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingEssentials, setLoadingEssentials] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data.categories || data || []);
      } catch { setCategories([]); }
      setLoadingCats(false);

      try {
        const { data } = await getFeaturedProducts();
        setFeatured(data.products || data || []);
      } catch { setFeatured([]); }
      setLoadingFeatured(false);

      try {
        const { data } = await getProducts({ limit: 8 });
        setEssentials(data.products || data || []);
      } catch { setEssentials([]); }
      setLoadingEssentials(false);
    };
    fetchData();
  }, []);

  const scrollCarousel = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -280 : 280,
        behavior: 'smooth',
      });
    }
  };

  const whyChooseUs = [
    { icon: '🌿', title: 'Farm Fresh', desc: 'Direct from farms to your doorstep with guaranteed freshness' },
    { icon: '🚚', title: 'Fast Delivery', desc: 'Get your groceries delivered in just 30 minutes' },
    { icon: '💰', title: 'Best Prices', desc: 'Competitive prices with regular deals and discounts' },
    { icon: '📦', title: 'Wide Range', desc: '1000+ products across all grocery categories' },
  ];

  return (
    <div>
      <HeroSection />

      {/* Offer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OfferBanner />
      </section>

      {/* Shop by Category */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        className="py-12 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark">
                Shop by Category
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Browse through your favorite categories
              </p>
            </div>
            <Link
              to="/categories"
              className="text-sm font-medium text-brand-primary hover:text-brand-accent flex items-center gap-1 transition-colors"
            >
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingCats
              ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
              : categories.slice(0, 6).map((cat) => (
                  <CategoryCard key={cat._id || cat.slug} category={cat} />
                ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        className="py-12 bg-brand-light"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark">
                Featured Products
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Handpicked products just for you
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {loadingFeatured
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[220px]" style={{ scrollSnapAlign: 'start' }}>
                    <ProductCardSkeleton />
                  </div>
                ))
              : featured.map((product) => (
                  <div key={product._id} className="flex-shrink-0 w-[220px]" style={{ scrollSnapAlign: 'start' }}>
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </motion.section>

      {/* Daily Essentials */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        className="py-12 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark">
                Daily Essentials
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Things you need every day
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-medium text-brand-primary hover:text-brand-accent flex items-center gap-1 transition-colors"
            >
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {loadingEssentials
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : essentials.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        className="py-16 bg-gradient-to-br from-green-50 to-brand-light"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark text-center mb-10">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Shop by Brand */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        className="py-12 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark text-center mb-8">
            Popular Brands
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {['Amul', 'Tata', 'Aashirvaad', 'Fortune', 'MTR', 'Haldirams', 'Dabur', 'Patanjali'].map(
              (brand) => (
                <Link
                  key={brand}
                  to={`/products?search=${brand}`}
                  className="px-6 py-3 bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors border border-gray-100"
                >
                  {brand}
                </Link>
              )
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
