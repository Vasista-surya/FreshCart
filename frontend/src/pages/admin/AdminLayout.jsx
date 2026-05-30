import { NavLink, Outlet } from 'react-router-dom'
import { HiOutlineChartBar, HiOutlineCube, HiOutlineClipboardList, HiOutlineUserGroup } from 'react-icons/hi'

const adminLinks = [
  { label: 'Dashboard', path: '/admin', icon: HiOutlineChartBar, end: true },
  { label: 'Products', path: '/admin/products', icon: HiOutlineCube },
  { label: 'Orders', path: '/admin/orders', icon: HiOutlineClipboardList },
  { label: 'Users', path: '/admin/users', icon: HiOutlineUserGroup },
]

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-3xl text-gray-900 mb-6">Admin Panel</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <nav className="card p-2 space-y-1 lg:sticky lg:top-24">
            {adminLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
                id={`admin-nav-${link.label.toLowerCase()}`}
              >
                <link.icon className="w-4.5 h-4.5" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
