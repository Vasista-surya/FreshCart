import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email', 'warning');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    showToast('Subscribed successfully! 🎉', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-brand-dark text-white">
      {/* Newsletter section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold mb-1">
                Stay updated with our latest offers
              </h3>
              <p className="text-sm text-gray-400">
                Get exclusive deals and fresh product updates in your inbox
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <FiMail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/60 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
                />
              </div>
              <button
                type="submit"
                className="bg-brand-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-accent transition-colors flex items-center gap-2 flex-shrink-0"
              >
                <FiSend size={14} />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-xs">
                RK
              </div>
              <span className="text-lg font-bold text-brand-secondary">
                Radhakrishna
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your premium destination for fresh groceries, daily essentials, and household items.
              Delivering divine quality to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-primary hover:text-white transition-colors"
              >
                <FiFacebook size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-primary hover:text-white transition-colors"
              >
                <FiInstagram size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-primary hover:text-white transition-colors"
              >
                <FiTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Shop' },
                { to: '/categories', label: 'Categories' },
                { to: '/about', label: 'About Us' },
                { to: '/orders', label: 'Track Order' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-brand-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { slug: 'fruits-vegetables', label: 'Fruits & Vegetables' },
                { slug: 'dairy-eggs', label: 'Dairy & Eggs' },
                { slug: 'grocery-staples', label: 'Grocery & Staples' },
                { slug: 'snacks-beverages', label: 'Snacks & Beverages' },
                { slug: 'household', label: 'Household Items' },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="text-gray-400 hover:text-brand-secondary transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <FiMapPin size={16} className="flex-shrink-0 mt-0.5 text-brand-primary" />
                <span>123 Market Street, Near Temple Road, City — 560001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone size={16} className="flex-shrink-0 text-brand-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail size={16} className="flex-shrink-0 text-brand-primary" />
                <span>support@radhakrishnastore.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Radhakrishna General Store. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              💳 Cards
            </span>
            <span className="flex items-center gap-1">
              📱 UPI
            </span>
            <span className="flex items-center gap-1">
              🏦 Net Banking
            </span>
            <span className="flex items-center gap-1">
              💵 COD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
