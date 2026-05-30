import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiEye, HiEyeOff, HiCheck } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const mascotStages = [
  { emoji: '🧺', text: "Let's get you started!", subtext: 'Create your FreshCart account' },
  { emoji: '📝', text: 'Fill in your details', subtext: 'Just a few more steps...' },
  { emoji: '🛒', text: 'Loading your cart...', subtext: 'Almost there!' },
  { emoji: '🎉', text: 'Welcome to FreshCart!', subtext: 'Your groceries await!' },
]

const groceryItems = ['🍎', '🥕', '🧀', '🥬', '🍞', '🥛', '🍌', '🍅', '🥚', '🧅']

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [bagItems, setBagItems] = useState([])
  const { signup } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error')
      return
    }

    setLoading(true)
    setStage(2) // Loading cart animation

    // Animate groceries falling into bag
    for (let i = 0; i < groceryItems.length; i++) {
      await new Promise(r => setTimeout(r, 150))
      setBagItems(prev => [...prev, groceryItems[i]])
    }

    try {
      await signup({ name, email, password })
      setStage(3) // Success!
      await new Promise(r => setTimeout(r, 2000))
      navigate('/')
    } catch (err) {
      addToast(err.response?.data?.message || 'Signup failed', 'error')
      setStage(0)
      setBagItems([])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[85vh] flex">
      {/* Left - Mascot Animation */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center text-white px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Mascot / Bag */}
              <motion.div
                animate={stage === 3 ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : { y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: stage === 3 ? 1 : 3, ease: 'easeInOut' }}
                className="relative mb-8"
              >
                <span className="text-8xl">{mascotStages[stage].emoji}</span>

                {/* Grocery items falling into bag */}
                {stage >= 2 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1 w-40">
                    {bagItems.map((item, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: -40, scale: 0 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        className="text-2xl"
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>

              <h2 className="font-display font-bold text-3xl mb-2">{mascotStages[stage].text}</h2>
              <p className="text-lg text-white/70">{mascotStages[stage].subtext}</p>

              {/* Progress dots */}
              <div className="flex items-center gap-2 mt-8">
                {mascotStages.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i <= stage ? 'bg-white' : 'bg-white/30'}`}
                    animate={i === stage ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                ))}
              </div>

              {stage === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="mt-6 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <HiCheck className="w-8 h-8 text-white" />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🛒</span>
              </div>
              <span className="font-display font-bold text-2xl">Fresh<span className="text-brand-600">Cart</span></span>
            </Link>
            <h1 className="font-display font-bold text-2xl text-gray-900 mb-1">Create your account</h1>
            <p className="text-sm text-gray-500">Start shopping for fresh groceries today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); if (stage === 0 && e.target.value) setStage(1) }}
                  required
                  className="input-field !pl-12"
                  placeholder="John Doe"
                  id="signup-name"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input-field !pl-12"
                  placeholder="you@example.com"
                  id="signup-email"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input-field !pl-12 !pr-12"
                  placeholder="Min 6 characters"
                  id="signup-password"
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters</p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5" id="signup-submit">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
