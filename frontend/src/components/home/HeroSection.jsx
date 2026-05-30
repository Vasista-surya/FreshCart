import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiArrowRight, HiOutlineTruck, HiOutlineClock, HiOutlineShieldCheck } from 'react-icons/hi'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Free delivery on orders above ₹499
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
            >
              Fresh Groceries
              <br />
              <span className="text-accent-400">Delivered Fast</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-white/80 mb-8 max-w-lg"
            >
              Get farm-fresh fruits, vegetables, dairy, and all your daily essentials delivered to your doorstep in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-xl shadow-black/10 hover:-translate-y-0.5" id="hero-shop-btn">
                Shop Now <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/categories" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                Browse Categories
              </Link>
            </motion.div>
          </div>

          {/* Hero image / floating elements */}
          <div className="hidden lg:flex items-center justify-center relative">
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center">
                <span className="text-[120px]">🛒</span>
              </div>
            </motion.div>

            {/* Floating items */}
            {['🍎', '🥬', '🥛', '🍪'].map((emoji, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3 + i, delay: i * 0.5, ease: 'easeInOut' }}
                className={`absolute ${
                  i === 0 ? 'top-4 left-4' : i === 1 ? 'top-8 right-8' : i === 2 ? 'bottom-8 left-8' : 'bottom-4 right-4'
                } w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center`}
              >
                <span className="text-3xl">{emoji}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16"
        >
          {[
            { icon: HiOutlineTruck, title: 'Fast Delivery', desc: 'Delivered in 30 minutes' },
            { icon: HiOutlineClock, title: 'Open 24/7', desc: 'Order anytime, anywhere' },
            { icon: HiOutlineShieldCheck, title: 'Quality Assured', desc: '100% genuine products' },
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10">
              <feat.icon className="w-8 h-8 text-accent-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">{feat.title}</h3>
                <p className="text-xs text-white/60">{feat.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
