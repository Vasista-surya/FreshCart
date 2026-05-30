import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
      >
        <div className="absolute inset-0 border-4 border-brand-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-brand-600 border-t-transparent rounded-full" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-sm font-semibold text-brand-600 tracking-widest uppercase"
      >
        Loading fresh goods...
      </motion.p>
    </div>
  )
}
