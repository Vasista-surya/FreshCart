import { Link } from 'react-router-dom'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'

const footerLinks = {
  shop: [
    { label: 'All Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'Fresh Fruits', path: '/products?category=Fruits' },
    { label: 'Vegetables', path: '/products?category=Vegetables' },
    { label: 'Dairy', path: '/products?category=Dairy' },
  ],
  account: [
    { label: 'My Orders', path: '/orders' },
    { label: 'Wishlist', path: '/wishlist' },
    { label: 'Cart', path: '/cart' },
    { label: 'Login', path: '/login' },
    { label: 'Sign Up', path: '/signup' },
  ],
  company: [
    { label: 'About Us', path: '/contact' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy Policy', path: '/contact' },
    { label: 'Terms of Service', path: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🛒</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Fresh<span className="text-brand-400">Cart</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Premium quality groceries, fresh produce, and daily essentials delivered to your doorstep. Quality you can trust.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <HiOutlineMail className="w-4 h-4 text-brand-400" />
                <span>support@freshcart.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <HiOutlinePhone className="w-4 h-4 text-brand-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <HiOutlineLocationMarker className="w-4 h-4 text-brand-400" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Account</h3>
            <ul className="space-y-2.5">
              {footerLinks.account.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FreshCart. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-brand-400 transition-colors"><FaFacebook className="w-4 h-4" /></a>
            <a href="#" className="text-gray-500 hover:text-brand-400 transition-colors"><FaTwitter className="w-4 h-4" /></a>
            <a href="#" className="text-gray-500 hover:text-brand-400 transition-colors"><FaInstagram className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
