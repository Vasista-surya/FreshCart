import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const offers = [
  {
    title: 'Fresh Fruits Festival',
    desc: 'Up to 30% off on seasonal fruits',
    emoji: '🍎',
    bg: 'from-orange-500 to-red-500',
    link: '/products?category=Fruits',
  },
  {
    title: 'Dairy Deals',
    desc: 'Buy 2 Get 1 Free on dairy products',
    emoji: '🥛',
    bg: 'from-blue-500 to-indigo-600',
    link: '/products?category=Dairy',
  },
  {
    title: 'Snack Attack',
    desc: 'Flat 20% off on all snacks & biscuits',
    emoji: '🍿',
    bg: 'from-amber-500 to-orange-600',
    link: '/products?category=Snacks',
  },
]

export default function OfferBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {offers.map((offer, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={offer.link}
              className={`block bg-gradient-to-r ${offer.bg} rounded-2xl p-6 text-white hover:shadow-xl transition-shadow group`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg mb-1">{offer.title}</h3>
                  <p className="text-sm text-white/80">{offer.desc}</p>
                  <span className="inline-block mt-3 text-sm font-semibold underline underline-offset-2 group-hover:no-underline">
                    Shop Now →
                  </span>
                </div>
                <span className="text-5xl group-hover:scale-110 transition-transform">{offer.emoji}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
