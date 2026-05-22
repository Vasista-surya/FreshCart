import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiSearch, FiMenu, FiX, FiHeart, FiLogOut, FiPackage, FiSettings, FiChevronDown, FiMapPin } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { BiGridAlt } from 'react-icons/bi';
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = ({ onCartOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearch(false);
    setShowUserMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-brand-primary'
        : 'text-gray-600 hover:text-brand-primary'
    }`;

  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
            : 'bg-white py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Logo + Location */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
                  RK
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-lg text-gray-900 tracking-tight">
                    Radhakrishna
                  </span>
                  <div className="flex items-center gap-1 -mt-0.5">
                    <FiMapPin size={10} className="text-brand-primary" />
                    <span className="text-[10px] text-gray-400">
                      Delivery in 30 min
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Center: Search (desktop) */}
            <div className="hidden md:flex flex-1 max-w-lg mx-4">
              <SearchBar />
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-6">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/products" className={navLinkClass}>Shop</NavLink>
              <NavLink to="/categories" className={navLinkClass}>Categories</NavLink>
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile search toggle */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FiSearch size={18} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FiHeart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={onCartOpen}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <HiOutlineShoppingBag size={20} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-semibold text-sm border border-brand-primary/20">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <FiChevronDown
                      size={14}
                      className={`hidden sm:block text-gray-400 transition-transform ${
                        showUserMenu ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-accent transition-colors"
                  >
                    <FiUser size={14} />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                )}

                {/* User dropdown */}
                <AnimatePresence>
                  {showUserMenu && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiUser size={15} className="text-gray-400" />
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiPackage size={15} className="text-gray-400" />
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiHeart size={15} className="text-gray-400" />
                        Wishlist
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <BiGridAlt size={15} className="text-gray-400" />
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-gray-50 mt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut size={15} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FiMenu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="px-4 py-3">
                <SearchBar
                  isMobile
                  onClose={() => setShowSearch(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 z-[80] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-72 h-full bg-white z-[90] shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-sm">
                    RK
                  </div>
                  <span className="font-bold text-lg text-gray-900">
                    Radhakrishna
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                >
                  <FiX size={18} />
                </button>
              </div>

              {isAuthenticated && (
                <div className="px-5 py-4 bg-brand-primary/5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 overflow-y-auto py-4">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/products', label: 'Shop' },
                  { to: '/categories', label: 'Categories' },
                  { to: '/about', label: 'About' },
                ].map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-5 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-brand-primary bg-brand-primary/5 border-r-2 border-brand-primary'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

                <div className="border-t border-gray-100 my-2" />

                {isAuthenticated ? (
                  <>
                    <NavLink
                      to="/profile"
                      className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/orders"
                      className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      My Orders
                    </NavLink>
                    <NavLink
                      to="/wishlist"
                      className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Wishlist
                    </NavLink>
                    {isAdmin && (
                      <NavLink
                        to="/admin"
                        className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Admin Dashboard
                      </NavLink>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-5 py-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/5"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
