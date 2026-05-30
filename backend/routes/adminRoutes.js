const router = require('express').Router()
const { adminAuth } = require('../middleware/auth')

const useMock = () => process.env.USE_MOCK_DB === 'true'
const getMockDb = () => require('../config/mockDb')

// GET /api/admin/dashboard
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    if (useMock()) {
      const db = getMockDb().getDb()
      return res.json({
        success: true,
        totalProducts: db.products.length,
        totalOrders: db.orders.length,
        totalUsers: db.users.length,
        totalRevenue: db.orders.reduce((s, o) => s + (o.total || 0), 0),
        recentOrders: db.orders.slice(-5).reverse().map(o => ({
          ...o, user: db.users.find(u => u._id === o.user) || { name: 'Unknown' }
        })),
      })
    }
    const Product = require('../models/Product')
    const Order = require('../models/Order')
    const User = require('../models/User')
    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      Product.countDocuments(), Order.countDocuments(), User.countDocuments(),
      Order.find().populate('user', 'name email').sort('-createdAt').limit(5),
    ])
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }])
    res.json({
      success: true, totalProducts, totalOrders, totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders: orders,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/admin/products
router.get('/products', adminAuth, async (req, res) => {
  try {
    if (useMock()) return res.json({ success: true, products: getMockDb().getDb().products })
    const Product = require('../models/Product')
    const products = await Product.find().sort('-createdAt')
    res.json({ success: true, products })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// POST /api/admin/products
router.post('/products', adminAuth, async (req, res) => {
  try {
    if (useMock()) {
      const { getDb, genId } = getMockDb()
      const product = { _id: genId(), ...req.body, isAvailable: req.body.stock > 0, isFeatured: false, rating: 4.0, numReviews: 0 }
      getDb().products.push(product)
      return res.status(201).json({ success: true, product })
    }
    const Product = require('../models/Product')
    const product = await Product.create(req.body)
    res.status(201).json({ success: true, product })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// PUT /api/admin/products/:id
router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    if (useMock()) {
      const db = getMockDb().getDb()
      const idx = db.products.findIndex(p => p._id === req.params.id)
      if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' })
      db.products[idx] = { ...db.products[idx], ...req.body, isAvailable: req.body.stock > 0 }
      return res.json({ success: true, product: db.products[idx] })
    }
    const Product = require('../models/Product')
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, product })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// DELETE /api/admin/products/:id
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    if (useMock()) {
      const db = getMockDb().getDb()
      db.products = db.products.filter(p => p._id !== req.params.id)
      return res.json({ success: true, message: 'Product deleted' })
    }
    const Product = require('../models/Product')
    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Product deleted' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// GET /api/admin/orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    if (useMock()) {
      const db = getMockDb().getDb()
      const orders = db.orders.map(o => ({
        ...o, user: db.users.find(u => u._id === o.user) || { name: 'Unknown' }
      })).reverse()
      return res.json({ success: true, orders })
    }
    const Order = require('../models/Order')
    const orders = await Order.find().populate('user', 'name email').populate('items.product').sort('-createdAt')
    res.json({ success: true, orders })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body
    if (useMock()) {
      const db = getMockDb().getDb()
      const order = db.orders.find(o => o._id === req.params.id)
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
      order.status = status
      return res.json({ success: true, order })
    }
    const Order = require('../models/Order')
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    res.json({ success: true, order })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// GET /api/admin/users
router.get('/users', adminAuth, async (req, res) => {
  try {
    if (useMock()) {
      const users = getMockDb().getDb().users.map(u => ({
        _id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt,
      }))
      return res.json({ success: true, users })
    }
    const User = require('../models/User')
    const users = await User.find().select('-password').sort('-createdAt')
    res.json({ success: true, users })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

module.exports = router
