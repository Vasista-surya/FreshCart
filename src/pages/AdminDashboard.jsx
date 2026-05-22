import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBarChart2,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiTag,
  FiList,
  FiCheck,
  FiX,
  FiEye,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';
import {
  getDashboard,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  getUsers,
  createCategory,
  getCategories,
  deleteCategory,
  createCoupon,
  getCoupons,
  deleteCoupon
} from '../services/api';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const { addToast } = useToast();

  // Load Initial Dashboard Data (Analytics)
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getDashboard();
      if (res.data?.success) {
        setDashboardData(res.data);
      } else {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch store analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Radhakrishna General Store</h1>
          <p className="text-gray-500 text-sm mt-1">Role: Store Manager Admin Console</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 bg-brand-light text-brand-primary border border-brand-primary/10 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-primary hover:text-white transition-all w-fit shadow-sm"
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Stats
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-100 scrollbar-hide">
        {[
          { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
          { id: 'products', label: 'Products', icon: FiBox },
          { id: 'orders', label: 'Orders', icon: FiShoppingBag },
          { id: 'categories', label: 'Categories', icon: FiList },
          { id: 'coupons', label: 'Coupons', icon: FiTag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setLoading(true);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-102'
                  : 'bg-white text-gray-500 hover:text-brand-primary hover:bg-brand-light border border-gray-100'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Rendering */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[500px]">
        {activeTab === 'analytics' && (
          <AnalyticsTab data={dashboardData} loading={loading} />
        )}
        {activeTab === 'products' && <ProductsTab addToast={addToast} />}
        {activeTab === 'orders' && <OrdersTab addToast={addToast} />}
        {activeTab === 'categories' && <CategoriesTab addToast={addToast} />}
        {activeTab === 'coupons' && <CouponsTab addToast={addToast} />}
      </div>
    </div>
  );
};

// ─── ANALYTICS SUBCOMPONENT ──────────────────────────────────────────────────
const AnalyticsTab = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl p-4" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="h-96 bg-gray-100 rounded-2xl lg:col-span-2" />
          <div className="h-96 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-gray-500">No analytics data available.</p>;

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(data.totalRevenue || 0).toFixed(2)}`,
      icon: FiTrendingUp,
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    {
      label: 'Total Orders',
      value: data.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    {
      label: 'Total Products',
      value: data.totalProducts || 0,
      icon: FiBox,
      color: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    },
    {
      label: 'Registered Customers',
      value: data.totalUsers || 0,
      icon: FiUsers,
      color: 'bg-amber-50 text-amber-600 border border-amber-100',
    },
  ];

  const statusCounts = data.orderStatusCounts || {};

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-6 rounded-2xl bg-white shadow-sm flex items-center justify-between ${stat.color}`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{stat.label}</span>
                <span className="text-2xl font-black text-gray-800 block mt-1">{stat.value}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/80 shadow-sm">
                <Icon size={24} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Stats Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiShoppingBag className="text-brand-primary" /> Recent Customer Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-400 font-semibold border-b border-gray-100">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentOrders?.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 font-semibold text-gray-600">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                    <td className="py-3">
                      <span className="font-bold text-gray-800 block">{order.user?.name || 'Guest User'}</span>
                      <span className="text-xs text-gray-400">{order.user?.email || 'N/A'}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                        order.orderStatus === 'Cancelled' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-brand-primary">₹{order.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
                {(!data.recentOrders || data.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-400">No orders placed recently.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Status Frequencies */}
        <div className="border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiBarChart2 className="text-brand-primary" /> Order Fulfillment
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Pending', count: statusCounts.pending || 0, color: 'bg-yellow-500' },
                { label: 'Confirmed', count: statusCounts.confirmed || 0, color: 'bg-blue-500' },
                { label: 'Packed', count: statusCounts.packed || 0, color: 'bg-indigo-500' },
                { label: 'Shipped', count: statusCounts.shipped || 0, color: 'bg-purple-500' },
                { label: 'Delivered', count: statusCounts.delivered || 0, color: 'bg-emerald-500' },
                { label: 'Cancelled', count: statusCounts.cancelled || 0, color: 'bg-rose-500' },
              ].map((item, idx) => {
                const total = Object.values(statusCounts).reduce((acc, curr) => acc + (curr || 0), 0) || 1;
                const percentage = ((item.count / total) * 100).toFixed(0);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-600">
                      <span>{item.label}</span>
                      <span>{item.count} order{item.count !== 1 ? 's' : ''} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PRODUCTS CRUD TAB ────────────────────────────────────────────────────────
const ProductsTab = ({ addToast }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    mrp: '',
    category: '',
    stock: 100,
    unit: 'pcs',
    weight: '',
    brand: '',
    image: '',
    isFeatured: false,
    isAvailable: true
  });

  const categoriesList = [
    'Rice', 'Atta / Flour', 'Pulses / Dal', 'Cooking Oils', 'Spices', 'Salt / Sugar',
    'Tea / Coffee', 'Biscuits', 'Snacks', 'Chocolates', 'Soft Drinks', 'Juices',
    'Dairy Products', 'Bread', 'Eggs', 'Fruits', 'Vegetables', 'Frozen Foods',
    'Instant Foods', 'Cleaning Supplies', 'Soaps', 'Shampoos', 'Toothpaste',
    'Detergents', 'Household Essentials', 'Baby Care Products'
  ];

  const unitsList = ['kg', 'g', 'L', 'ml', 'pack', 'pcs', 'box'];

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAdminProducts({ search, page, limit: 10 });
      if (res.data?.success) {
        setProducts(res.data.products);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch products catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        mrp: product.mrp || '',
        category: product.category || '',
        stock: product.stock !== undefined ? product.stock : 100,
        unit: product.unit || 'pcs',
        weight: product.weight || '',
        brand: product.brand || '',
        image: product.image || '',
        isFeatured: product.isFeatured || false,
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        mrp: '',
        category: '',
        stock: 100,
        unit: 'pcs',
        weight: '',
        brand: '',
        image: '',
        isFeatured: false,
        isAvailable: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      addToast('Please complete name, price, category, and image URL', 'warning');
      return;
    }

    try {
      if (selectedProduct) {
        // Edit Product
        const res = await updateProduct(selectedProduct._id, formData);
        if (res.data?.success) {
          addToast('Product updated successfully', 'success');
          fetchProducts();
        }
      } else {
        // Add Product
        const res = await createProduct(formData);
        if (res.data?.success) {
          addToast('Product added successfully', 'success');
          fetchProducts();
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save product details', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grocery product?')) return;
    try {
      const res = await deleteProduct(id);
      if (res.data?.success) {
        addToast('Product deleted successfully', 'success');
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete product', 'error');
    }
  };

  const handleStockUpdate = async (product, newStock) => {
    const stockVal = Math.max(0, parseInt(newStock) || 0);
    try {
      const res = await updateProduct(product._id, { stock: stockVal });
      if (res.data?.success) {
        setProducts(products.map(p => p._id === product._id ? { ...p, stock: stockVal } : p));
        addToast(`Updated ${product.name} stock to ${stockVal}`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update product stock', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary pr-10 text-sm font-medium"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-accent text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-brand-primary/20 hover:shadow-lg transition-all w-full sm:w-auto"
        >
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {/* Catalog Table */}
      {loading ? (
        <div className="space-y-3 py-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm bg-white">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 font-bold border-b border-gray-100">
                <th className="p-4">Image</th>
                <th className="p-4">Name / Brand</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price / MRP</th>
                <th className="p-4">Stock Inventory</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-contain bg-gray-50 border border-gray-100 rounded-lg"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=Item'; }}
                    />
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-gray-800 block leading-tight">{product.name}</span>
                    <span className="text-xs text-gray-400 mt-0.5 block">{product.brand || 'Radhakrishna'} &bull; {product.weight} {product.unit}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{product.category}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-brand-primary block">₹{product.price.toFixed(2)}</span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="text-xs text-gray-400 line-through">MRP: ₹{product.mrp.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStockUpdate(product, product.stock - 5)}
                        className="w-6 h-6 border border-gray-200 hover:bg-gray-100 flex items-center justify-center rounded text-gray-600 font-bold transition-all text-xs"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleStockUpdate(product, e.target.value)}
                        className="w-16 px-1.5 py-1 text-center font-bold text-gray-800 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                      />
                      <button
                        onClick={() => handleStockUpdate(product, product.stock + 5)}
                        className="w-6 h-6 border border-gray-200 hover:bg-gray-100 flex items-center justify-center rounded text-gray-600 font-bold transition-all text-xs"
                      >
                        +
                      </button>
                      {product.stock <= 5 && (
                        <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded font-extrabold flex items-center gap-0.5 uppercase tracking-wide">
                          <FiAlertCircle size={10} /> Low
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                        title="Edit Details"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                        title="Delete Product"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 font-medium">No grocery items match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all font-semibold"
          >
            <FiChevronLeft size={16} />
          </button>
          <span className="text-sm font-bold text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all font-semibold"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-gray-100 p-6 sticky top-0 bg-white z-10">
                <h3 className="text-xl font-black text-gray-800">{selectedProduct ? 'Edit Grocery Item' : 'Add New Grocery Item'}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-all"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Fortune Soya Health Oil"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none bg-white text-sm font-semibold"
                    >
                      <option value="">Select Category</option>
                      {categoriesList.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Brand */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Brand Name</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g. Fortune, Amul, Nestle"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Selling Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 175"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>

                  {/* MRP */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">MRP Value (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      placeholder="e.g. 195"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>

                  {/* Weight / Volume */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Weight / Volume Value</label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="e.g. 1, 500, 250"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>

                  {/* Unit */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Unit Measure</label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none bg-white font-semibold text-sm"
                    >
                      {unitsList.map((unit, idx) => (
                        <option key={idx} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stock */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Initial Stock Level</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="100"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Product Image URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="e.g. https://images.unsplash.com/photo-xxx..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Product Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Provide helpful facts, ingredients, storage rules..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>

                  {/* Featured & Available Toggles */}
                  <div className="md:col-span-2 flex gap-8 items-center border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary focus:outline-none focus:ring-offset-0"
                      />
                      <span className="text-sm font-bold text-gray-700">Feature on Homepage</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isAvailable}
                        onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary focus:outline-none focus:ring-offset-0"
                      />
                      <span className="text-sm font-bold text-gray-700">In Stock / Available</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-primary hover:bg-brand-accent text-white font-bold text-sm rounded-xl shadow-md shadow-brand-primary/20 transition-all hover:shadow-lg"
                  >
                    {selectedProduct ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── ORDERS MANAGEMENT TAB ───────────────────────────────────────────────────
const OrdersTab = ({ addToast }) => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAdminOrders({ status: statusFilter, page, limit: 10 });
      if (res.data?.success) {
        setOrders(res.data.orders);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load customer orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.data?.success) {
        addToast(`Order advanced to: ${newStatus}`, 'success');
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update status', 'error');
    }
  };

  const orderStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-60 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white text-sm font-semibold"
        >
          <option value="">All Fulfillment Statuses</option>
          {orderStatuses.map((status, idx) => (
            <option key={idx} value={status}>{status}</option>
          ))}
        </select>
        <span className="text-xs font-bold text-gray-400 tracking-wide uppercase">Fulfillment Desk</span>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="space-y-3 py-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm bg-white">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 font-bold border-b border-gray-100">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer Contact</th>
                <th className="p-4">Order Date</th>
                <th className="p-4">Billing Total</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-center">Invoice View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="p-4 font-bold text-gray-600">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                  <td className="p-4">
                    <span className="font-extrabold text-gray-800 block">{order.user?.name || 'Walk-in Customer'}</span>
                    <span className="text-xs text-gray-400 mt-0.5 block">{order.user?.email || 'N/A'} &bull; {order.shippingAddress?.phone || 'No Phone'}</span>
                  </td>
                  <td className="p-4 text-gray-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-brand-primary block">₹{order.totalAmount.toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{order.paymentMethod} &bull; {order.paymentStatus}</span>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none ${
                        order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        order.orderStatus === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {orderStatuses.map((status, idx) => (
                        <option key={idx} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg transition-all border border-brand-primary/10 shadow-sm"
                      title="Inspect Invoice"
                    >
                      <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 font-medium">No order files in this queue.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all font-semibold"
          >
            <FiChevronLeft size={16} />
          </button>
          <span className="text-sm font-bold text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all font-semibold"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl p-6"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4 sticky top-0 bg-white">
                <div>
                  <h3 className="text-lg font-black text-gray-800">Order Invoice Detail</h3>
                  <span className="text-xs font-semibold text-gray-400 block mt-0.5">Order ID: #{selectedOrder._id.toUpperCase()}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-all"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Items */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Order Items</span>
                  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/30 space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center gap-4 border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-contain rounded-lg border border-gray-100 bg-white"
                          />
                          <div>
                            <span className="text-sm font-bold text-gray-800 block line-clamp-1">{item.name}</span>
                            <span className="text-xs text-gray-400 block">{item.weight || item.unit} &bull; Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-100 rounded-xl p-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">Delivery Target</span>
                    {selectedOrder.shippingAddress ? (
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-extrabold text-gray-800">{selectedOrder.shippingAddress.name}</p>
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                        <p className="pt-1 font-semibold text-gray-500">Phone: {selectedOrder.shippingAddress.phone}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No address</p>
                    )}
                  </div>

                  <div className="border border-gray-100 rounded-xl p-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">Billing Invoice</span>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>Discount:</span>
                          <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>GST Tax (5%):</span>
                        <span>₹{selectedOrder.tax?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-brand-primary pt-2 border-t border-dashed border-gray-100 mt-2">
                        <span>Paid Total:</span>
                        <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fulfillment Dropdown */}
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Fulfillment Action</span>
                    <span className="text-xs text-gray-500 block">Advance status to dispatch item</span>
                  </div>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-extrabold bg-white focus:outline-none"
                  >
                    {orderStatuses.map((status, idx) => (
                      <option key={idx} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── CATEGORIES TAB ───────────────────────────────────────────────────────────
const CategoriesTab = ({ addToast }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    icon: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      // Backend returns categories list
      setCategories(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load categories list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    try {
      const res = await createCategory(formData);
      if (res.data?.success) {
        addToast('New Category added successfully', 'success');
        setFormData({ name: '', description: '', image: '', icon: '' });
        setIsFormOpen(false);
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to create category', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await deleteCategory(id);
      if (res.data?.success) {
        addToast('Category deleted successfully', 'success');
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete category', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black text-gray-800">Categories Desk</h3>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1 bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all"
        >
          {isFormOpen ? <FiX size={14} /> : <FiPlus size={14} />}
          {isFormOpen ? 'Close Panel' : 'Add Category'}
        </button>
      </div>

      {isFormOpen && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50 space-y-4 max-w-xl"
        >
          <h4 className="font-extrabold text-sm text-gray-700">Add New Store Category</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Category Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Cooking Oils"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Icon (Emoji/Shortcode)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g. 🌻 or cooking-oil"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm font-medium"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm font-medium"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. Pure cooking oils, mustard, olive, sunflower..."
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm font-medium"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-brand-primary hover:bg-brand-accent text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-brand-primary/20 transition-all"
          >
            Create Category
          </button>
        </motion.form>
      )}

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <FiRefreshCw className="animate-spin text-brand-primary" size={24} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-start bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center text-xl font-bold border border-brand-primary/10">
                  {cat.icon || '📦'}
                </div>
                <div>
                  <span className="font-extrabold text-gray-800 block text-sm">{cat.name}</span>
                  <span className="text-xs text-gray-400 mt-0.5 block line-clamp-1">{cat.description || 'No description'}</span>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 mt-1.5 inline-block">{cat.productCount || 0} Products</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(cat._id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Delete Category"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center py-10 text-gray-400 font-medium col-span-3">No categories cataloged yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── COUPONS TAB ──────────────────────────────────────────────────────────────
const CouponsTab = ({ addToast }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await getCoupons();
      setCoupons(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load store promo codes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) return;
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined
      };
      const res = await createCoupon(payload);
      if (res.data?.success) {
        addToast('New coupon created successfully', 'success');
        setFormData({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscount: '', usageLimit: '' });
        setIsFormOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to create promo coupon', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this coupon?')) return;
    try {
      const res = await deleteCoupon(id);
      if (res.data?.success) {
        addToast('Coupon deleted successfully', 'success');
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete coupon', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black text-gray-800">Coupons Desk</h3>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1 bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all"
        >
          {isFormOpen ? <FiX size={14} /> : <FiPlus size={14} />}
          {isFormOpen ? 'Close Panel' : 'Create Coupon'}
        </button>
      </div>

      {isFormOpen && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50 space-y-4 max-w-xl"
        >
          <h4 className="font-extrabold text-sm text-gray-700">Add Promo Discount Code</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Promo Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. FRESH50"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm font-semibold"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Cash (₹)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Discount Value *</label>
              <input
                type="number"
                required
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder="e.g. 10 or 150"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Min Order Spend (₹)</label>
              <input
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                placeholder="e.g. 500"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Max Discount Cap (₹)</label>
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                placeholder="e.g. 100"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="e.g. 200"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm font-medium"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-brand-primary hover:bg-brand-accent text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-brand-primary/20 transition-all"
          >
            Generate Coupon
          </button>
        </motion.form>
      )}

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <FiRefreshCw className="animate-spin text-brand-primary" size={24} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="border border-dashed border-brand-primary/30 rounded-xl p-4 bg-brand-light/20 flex justify-between items-start shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase bg-brand-primary text-white px-2.5 py-1 rounded-lg tracking-wider border border-brand-primary/20">
                    {coupon.code}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold">{coupon.discountType === 'percentage' ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Off`}</span>
                </div>
                <div className="text-xs text-gray-500 font-semibold space-y-1">
                  <p>Min Order Spend: ₹{coupon.minOrderAmount || 0}</p>
                  {coupon.maxDiscount && <p>Max Discount Cap: ₹{coupon.maxDiscount}</p>}
                  <p>Usage: {coupon.usedCount || 0} used {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(coupon._id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Delete Coupon"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}
          {coupons.length === 0 && (
            <p className="text-center py-10 text-gray-400 font-medium col-span-3">No active discount coupons found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
