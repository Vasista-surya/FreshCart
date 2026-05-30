import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, (error) => Promise.reject(error))

// Handle 401 — force logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth ──
export const loginUser = (data) => API.post('/auth/login', data)
export const registerUser = (data) => API.post('/auth/register', data)
export const getProfile = () => API.get('/auth/profile')
export const updateProfile = (data) => API.put('/auth/profile', data)

// ── Products ──
export const getProducts = (params) => API.get('/products', { params })
export const getFeaturedProducts = () => API.get('/products/featured')
export const searchProducts = (query) => API.get('/products/search', { params: { q: query } })
export const getProductById = (id) => API.get(`/products/${id}`)

// ── Categories ──
export const getCategories = () => API.get('/categories')

// ── Cart ──
export const getCart = () => API.get('/cart')
export const addToCart = (productId, quantity) => API.post('/cart', { productId, quantity })
export const updateCartItem = (productId, quantity) => API.put(`/cart/${productId}`, { quantity })
export const removeCartItem = (productId) => API.delete(`/cart/${productId}`)
export const clearCart = () => API.delete('/cart')

// ── Orders ──
export const createOrder = (data) => API.post('/orders', data)
export const getOrders = () => API.get('/orders')
export const getOrderById = (id) => API.get(`/orders/${id}`)

// ── Wishlist ──
export const getWishlist = () => API.get('/wishlist')
export const addToWishlist = (productId) => API.post('/wishlist', { productId })
export const removeFromWishlist = (productId) => API.delete(`/wishlist/${productId}`)

// ── Admin ──
export const getDashboard = () => API.get('/admin/dashboard')
export const getAdminProducts = (params) => API.get('/admin/products', { params })
export const createProduct = (data) => API.post('/admin/products', data)
export const updateProduct = (id, data) => API.put(`/admin/products/${id}`, data)
export const deleteProduct = (id) => API.delete(`/admin/products/${id}`)
export const getAdminOrders = (params) => API.get('/admin/orders', { params })
export const updateOrderStatus = (id, status) => API.put(`/admin/orders/${id}/status`, { status })
export const getUsers = () => API.get('/admin/users')

export default API
