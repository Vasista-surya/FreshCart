import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import AnimatedCharacter from '../components/AnimatedCharacter';

// Floating Grocery Icons to orbit the Login Card
const FLOATING_ICONS = [
  { id: 1, char: '🍎', size: 'text-2xl', x: -200, y: -150, delay: 0 },
  { id: 2, char: '🥛', size: 'text-xl', x: 220, y: -180, delay: 0.5 },
  { id: 3, char: '🍪', size: 'text-2xl', x: -220, y: 120, delay: 1 },
  { id: 4, char: '🍿', size: 'text-lg', x: 210, y: 140, delay: 1.5 },
  { id: 5, char: '🥦', size: 'text-2xl', x: -50, y: -220, delay: 2 },
  { id: 6, char: '🍞', size: 'text-xl', x: 80, y: 220, delay: 2.5 },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  // Character States
  const [characterState, setCharacterState] = useState('walk-in');
  const [characterX, setCharacterX] = useState(-300);

  // 1. Walk-in and Greet animation on mount
  useEffect(() => {
    const dummy = { x: -300 };
    const walkTimeline = gsap.timeline({
      onComplete: () => {
        setCharacterState('waving');
      }
    });

    walkTimeline.to(dummy, {
      x: 0,
      duration: 3.2,
      onUpdate: function() {
        setCharacterX(dummy.x);
      },
      ease: "power1.out"
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    // Dynamic interaction: character smiles happily when signing in
    setCharacterState('happy-thumbsup');

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Direct redirect with positive exit transition
      setCharacterState('walk-out');
      const dummy = { x: 0 };
      const exitTimeline = gsap.timeline({
        onComplete: () => {
          navigate(from, { replace: true });
        }
      });
      exitTimeline.to(dummy, {
        x: 400,
        duration: 2.2,
        onUpdate: function() {
          setCharacterX(dummy.x);
        },
        ease: "power1.in"
      });
    } else {
      // Revert character state if login failed
      setCharacterState('waving');
      setError(result.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#3f2ebd] flex items-center justify-center overflow-hidden px-4 py-8 relative">
      {/* Devotional radial halo backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* LEFT COLUMN: THE GREETING CANVAS */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[380px] lg:min-h-[500px] relative">
          
          {/* Subtle Halo behind character */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-amber-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-80" />

          {/* CHARACTER RIG */}
          <div 
            className="w-64 h-96 relative flex items-center justify-center"
            style={{ transform: `translateX(${characterX}px)` }}
          >
            <AnimatedCharacter 
              state={characterState} 
              bagState="full" // Carrying full grocery bag on login greeting
            />
          </div>

          {/* ACTION LABELS */}
          <div className="text-center mt-6 z-20 max-w-sm px-4">
            <AnimatePresence mode="wait">
              {characterState === 'walk-in' && (
                <motion.p 
                  key="walk"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-amber-100/90 text-sm font-medium tracking-wide"
                >
                  🚶‍♂️ Bringing fresh essentials to you...
                </motion.p>
              )}
              {characterState === 'waving' && (
                <motion.p 
                  key="wave"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-cyan-100 font-semibold text-sm tracking-wide"
                >
                  👋 Haribol! Welcome back to Radhakrishna Store!
                </motion.p>
              )}
              {characterState === 'happy-thumbsup' && (
                <motion.p 
                  key="verify"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-emerald-300 font-bold text-sm tracking-wide"
                >
                  ✨ Verification successful! Logging you in...
                </motion.p>
              )}
              {characterState === 'walk-out' && (
                <motion.p 
                  key="exit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-amber-200 text-sm font-medium tracking-wide"
                >
                  🛒 Entering the storefront...
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: GLASSMORPHISM CARD */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          
          {/* Floating Orbiting Emojis surrounding the card */}
          {characterState === 'waving' && FLOATING_ICONS.map((ico) => (
            <motion.div
              key={ico.id}
              className={`absolute select-none pointer-events-none ${ico.size} filter drop-shadow-md z-25`}
              style={{ x: ico.x, y: ico.y }}
              animate={{ 
                y: [ico.y - 12, ico.y + 12, ico.y - 12],
                rotate: [-6, 6, -6]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: ico.delay,
                ease: "easeInOut"
              }}
            >
              {ico.char}
            </motion.div>
          ))}

          {/* LOGIN CARD */}
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl relative">
            {/* Devotional Om background badge */}
            <div className="absolute top-6 right-8 text-white/10 text-4xl font-bold select-none pointer-events-none">
              ॐ
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-wide">SIGN IN</h2>
              <p className="text-purple-200 text-sm mt-1.5 font-medium">Log in to your Radhakrishna account</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/20 border border-red-500/40 text-red-100 text-sm rounded-xl p-3 mb-5 text-center font-medium"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="you@example.com" 
                    className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all font-medium"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all font-medium"
                    required
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Gradient Cyan submit button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-cyan-400 to-teal-400 text-[#1e1b4b] py-3.5 rounded-xl font-extrabold text-sm tracking-wider uppercase hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-xs text-purple-200 mt-6 font-semibold uppercase tracking-wider">
              New to Radhakrishna?{' '}
              <Link to="/register" className="text-cyan-300 hover:text-cyan-200 hover:underline transition-all">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
