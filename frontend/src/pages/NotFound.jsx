import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-8xl mb-6"
        >
          🛒
        </motion.div>
        <h1 className="font-display font-bold text-6xl text-gray-900 mb-2">404</h1>
        <h2 className="font-display font-semibold text-xl text-gray-600 mb-4">Page not found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like this aisle doesn't exist. Let's get you back to shopping.
        </p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </motion.div>
    </div>
  )
}
