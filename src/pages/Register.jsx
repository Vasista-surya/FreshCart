import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import AnimatedCharacter from '../components/AnimatedCharacter';

// Swirling Grocery Items List
const SWIRL_ITEMS = [
  { id: 1, label: 'Rice Bag', icon: '🌾', color: 'from-amber-200 to-yellow-400' },
  { id: 2, label: 'Atta', icon: '🍞', color: 'from-orange-200 to-amber-300' },
  { id: 3, label: 'Milk Packet', icon: '🥛', color: 'from-blue-200 to-indigo-300' },
  { id: 4, label: 'Vegetables', icon: '🥦', color: 'from-green-200 to-emerald-400' },
  { id: 5, label: 'Fruits', icon: '🍎', color: 'from-red-200 to-rose-400' },
  { id: 6, label: 'Biscuits', icon: '🍪', color: 'from-yellow-200 to-amber-500' },
  { id: 7, label: 'Oil Bottle', icon: '🍾', color: 'from-yellow-100 to-amber-400' },
  { id: 8, label: 'Chips', icon: '🍿', color: 'from-rose-200 to-red-400' },
  { id: 9, label: 'Pulses', icon: '🫘', color: 'from-amber-300 to-orange-500' },
  { id: 10, label: 'Tea Packet', icon: '☕', color: 'from-stone-300 to-stone-500' },
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Storyboard animation states
  const [characterState, setCharacterState] = useState('walk-in'); // 'walk-in' | 'idle' | 'surprised' | 'happy-thumbsup' | 'walk-out'
  const [bagState, setBagState] = useState('empty'); // 'empty' | 'half' | 'full'
  const [characterX, setCharacterX] = useState(-300); // starts offscreen left
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [isSwirling, setIsSwirling] = useState(false);
  const [isSucking, setIsSucking] = useState(false); // flying to bag
  const [particles, setParticles] = useState([]);

  // Element Refs for GSAP
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  // 1. Initial Walk-in Animation
  useEffect(() => {
    const dummy = { x: -300 };
    // Character walks from x: -300 to x: 0
    const walkTimeline = gsap.timeline({
      onComplete: () => {
        setCharacterState('idle');
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Spawn Glowing Background Particles
  const spawnSparkles = () => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        id: i,
        x: Math.random() * 250 - 125,
        y: Math.random() * 250 - 125,
        scale: Math.random() * 0.8 + 0.4,
        delay: Math.random() * 1.5
      });
    }
    setParticles(arr);
  };

  // 2. Submit & Animate Storyboard
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('📝 Register form submitted with values (formData):', { ...form, password: '***', confirmPassword: '***' });

    // Pre-validations
    if (!form.name || !form.email || !form.password) {
      console.warn('⚠️ Register form validation failed: missing fields');
      setError('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setCharacterState('surprised');
    setIsSwirling(true);
    spawnSparkles();

    // GSAP orbital swirl timeline for grocery icons
    const swirlTl = gsap.timeline();

    itemsRef.current.forEach((itemEl, idx) => {
      if (!itemEl) return;
      const angle = (idx / SWIRL_ITEMS.length) * Math.PI * 2;
      
      // Starting positions at center of character (around head/chest)
      gsap.set(itemEl, { x: 0, y: 0, scale: 0.1, opacity: 0 });

      // Spiral orbit animate out
      swirlTl.to(itemEl, {
        duration: 1.5,
        opacity: 1,
        scale: 1,
        x: Math.cos(angle) * 110,
        y: Math.sin(angle) * 110 - 40,
        ease: "back.out(1.7)",
      }, idx * 0.1);

      // Continuous swirling rotation loop
      gsap.to(itemEl, {
        duration: 3,
        repeat: -1,
        ease: "none",
        onUpdate: function() {
          if (isSucking) return; // ignore if flying into bag
          const time = this.time() * 2 + idx;
          const currentAngle = angle + time * 0.8;
          gsap.set(itemEl, {
            x: Math.cos(currentAngle) * (110 + Math.sin(time) * 10),
            y: Math.sin(currentAngle) * (110 + Math.cos(time) * 10) - 40,
            rotation: -currentAngle * (180 / Math.PI) // Keep icon upright
          });
        }
      });
    });

    // Run actual API register call
    const result = await register(form.name, form.email, form.password, form.phone);

    if (!result.success) {
      // Abort animations if registration fails
      setIsSwirling(false);
      setCharacterState('idle');
      setLoading(false);
      setError(result.message || 'Registration failed');
      return;
    }

    // --- SUCCESS ROADMAP ANIMATION ---
    setTimeout(() => {
      // Phase 2: Bag Fill Animation
      setIsSucking(true);
      
      const suckTl = gsap.timeline({
        onComplete: () => {
          setIsSwirling(false);
          // Transition to full bag
          setBagState('full');
          setCharacterState('happy-thumbsup');
          setShowSuccessBanner(true);

          // Phase 4: Walk away carrying full grocery bag after banner display
          setTimeout(() => {
            setShowSuccessBanner(false);
            setCharacterState('walk-out');

            const dummy = { x: 0 };
            const exitTl = gsap.timeline({
              onComplete: () => {
                navigate('/');
              }
            });

            exitTl.to(dummy, {
              x: 400,
              duration: 2.8,
              onUpdate: function() {
                setCharacterX(dummy.x);
              },
              ease: "power1.in"
            });
          }, 3000);
        }
      });

      // Animate grocery products falling into the bag (bag sits at roughly x: -40, y: 30 relative to center)
      itemsRef.current.forEach((itemEl, idx) => {
        if (!itemEl) return;
        
        // Items pack into the bag coordinates
        suckTl.to(itemEl, {
          duration: 0.8,
          x: -42,
          y: 28,
          scale: 0.2,
          opacity: 0,
          ease: "power2.in"
        }, idx * 0.08);

        // Update bag fullness mid-way through flying items
        if (idx === Math.floor(SWIRL_ITEMS.length / 2)) {
          setTimeout(() => setBagState('half'), idx * 80 + 300);
        }
      });

    }, 2800); // Allow swirls to orbit for a short moment before bag filling
  };

  return (
    <div className="min-h-screen bg-[#3f2ebd] flex items-center justify-center overflow-hidden px-4 py-8 relative">
      {/* Devotional background aura radial grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Grid Wrapper */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* LEFT COLUMN: THE ANIMATION CANVAS */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[380px] lg:min-h-[500px] relative">
          
          {/* Glowing Divine Halo Aura */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-amber-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-80" />

          {/* CHARACTER CONTAINER */}
          <div 
            ref={containerRef}
            className="w-64 h-96 relative flex items-center justify-center"
            style={{ transform: `translateX(${characterX}px)` }}
          >
            {/* Swirling orbiting items wrapper */}
            {isSwirling && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                
                {/* Orbital Sparkling Elements */}
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute w-2 h-2 rounded-full bg-yellow-300"
                    style={{ x: p.x, y: p.y }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, p.scale, 0],
                      y: p.y - 40 
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: "easeOut"
                    }}
                  />
                ))}

                {/* Main Swirl Grocery Cards */}
                {SWIRL_ITEMS.map((item, idx) => (
                  <div
                    key={item.id}
                    ref={(el) => (itemsRef.current[idx] = el)}
                    className={`absolute w-12 h-12 rounded-full bg-gradient-to-tr ${item.color} shadow-lg border border-white/40 flex items-center justify-center text-xl z-30`}
                    style={{ transformOrigin: 'center' }}
                  >
                    {item.icon}
                  </div>
                ))}
              </div>
            )}

            {/* Render dynamically rigged character component */}
            <AnimatedCharacter 
              state={characterState} 
              bagState={bagState} 
            />
          </div>

          {/* STORY TELLING SUB-TEXT CAPTIONS */}
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
                  🚶‍♂️ Entering Radhakrishna General Store with empty bag...
                </motion.p>
              )}
              {characterState === 'idle' && (
                <motion.p 
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-cyan-100/90 text-sm font-medium tracking-wide"
                >
                  ✨ Ready to fill up your bag? Enter details to register!
                </motion.p>
              )}
              {characterState === 'surprised' && isSwirling && !isSucking && (
                <motion.p 
                  key="magic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-yellow-300 font-semibold text-sm tracking-widest uppercase animate-pulse"
                >
                  💫 Magical Groceries Formulating! 💫
                </motion.p>
              )}
              {isSucking && (
                <motion.p 
                  key="suck"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-green-300 font-bold text-sm tracking-wide"
                >
                  🥬 packing fresh groceries into the bag... 🥛
                </motion.p>
              )}
              {characterState === 'happy-thumbsup' && showSuccessBanner && (
                <motion.p 
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-emerald-300 font-bold text-base tracking-wide"
                >
                  🎉 Thumbs up! Account created successfully. 👍
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
                  🛒 Walking away happily to start shopping!
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: THE GLASSMORPHISM SIGNUP CARD */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl relative">
            
            {/* Small lotus symbol watermark */}
            <div className="absolute top-6 right-8 text-white/10 text-4xl font-bold select-none pointer-events-none">
              ॐ
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-wide">REGISTER NOW</h2>
              <p className="text-purple-200 text-sm mt-1.5 font-medium">Use this form to register as a new client</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="bg-red-500/20 border border-red-500/40 text-red-100 text-sm rounded-xl p-3 mb-4 text-center font-medium"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1">Your full name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange}
                    placeholder="First Name & Last Name" 
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all font-medium"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1">Email Address *</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange}
                    placeholder="name@email.com" 
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all font-medium"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <input 
                    type="tel" 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange}
                    placeholder="10-digit number" 
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all font-medium"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1">Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange}
                    placeholder="Min 6 characters" 
                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all font-medium"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1">Confirm Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={form.confirmPassword} 
                    onChange={handleChange}
                    placeholder="Verify password" 
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all font-medium"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Gradient Cyan Submit Button */}
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
                    Creating Account...
                  </span>
                ) : 'Get started'}
              </button>
            </form>

            <p className="text-center text-xs text-purple-200 mt-6 font-semibold uppercase tracking-wider">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-300 hover:text-cyan-200 hover:underline transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RETAILER DEVOTIONAL BRANDING FLOATING SUCCESS CAPTION LAYER */}
      <AnimatePresence>
        {showSuccessBanner && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center bg-indigo-950/90 border-2 border-amber-400 backdrop-blur-lg px-8 py-6 rounded-3xl shadow-2xl max-w-md w-11/12"
          >
            <span className="text-4xl">🔱</span>
            <h1 className="text-xl lg:text-2xl font-black text-amber-300 mt-3 tracking-wide uppercase">
              Welcome to Radhakrishna General Store
            </h1>
            <p className="text-amber-100/90 text-sm mt-2 font-medium tracking-wide">
              Your neighborhood daily essential store is now online! Preparing your cart...
            </p>
            {/* Showering sparkly particles */}
            <div className="flex justify-center gap-2 mt-4 text-xl">
              <span>🌾</span><span>🥛</span><span>🍎</span><span>🥬</span><span>🍪</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
