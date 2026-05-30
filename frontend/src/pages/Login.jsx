import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const floatingItems = ['🍎', '🥕', '🧀', '🥬', '🍞', '🥛', '🍌', '🧅']

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid credentials', 'error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[85vh] flex">
      {/* Left - Animation Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {floatingItems.map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                top: `${10 + (i * 12) % 80}%`,
                left: `${5 + (i * 15) % 85}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 4 + i * 0.5,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative text-center text-white z-10 px-12"
        >
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-8xl mb-8"
          >
            🛒
          </motion.div>
          <h2 className="font-display font-bold text-4xl mb-4">Welcome Back!</h2>
          <p className="text-lg text-white/70">Your fresh groceries are waiting for you</p>
        </motion.div>
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
            <h1 className="font-display font-bold text-2xl text-gray-900 mb-1">Sign in to your account</h1>
            <p className="text-sm text-gray-500">Enter your credentials to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  id="login-email"
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
                  className="input-field !pl-12 !pr-12"
                  placeholder="••••••••"
                  id="login-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5" id="login-submit">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">Create one</Link>
          </p>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-600">Admin: <code className="bg-gray-200 px-1 rounded">admin@freshcart.com</code> / <code className="bg-gray-200 px-1 rounded">admin123</code></p>
            <p className="text-xs text-gray-600 mt-1">User: <code className="bg-gray-200 px-1 rounded">user@freshcart.com</code> / <code className="bg-gray-200 px-1 rounded">user123</code></p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
