const router = require('express').Router()
const { auth } = require('../middleware/auth')

const useMock = () => process.env.USE_MOCK_DB === 'true'
const getMockDb = () => require('../config/mockDb')

// POST /api/orders
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, deliveryFee, total } = req.body

    if (useMock()) {
      const { getDb, genId } = getMockDb()
      const db = getDb()
      const order = {
        _id: genId(),
        user: req.userId,
        items: items.map(i => ({
          product: db.products.find(p => p._id === i.product) || { _id: i.product },
          quantity: i.quantity,
          price: i.price,
        })),
        shippingAddress, paymentMethod, subtotal, deliveryFee, total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      db.orders.push(order)
      return res.status(201).json({ success: true, order })
    }

    const Order = require('../models/Order')
    const order = await Order.create({ user: req.userId, items, shippingAddress, paymentMethod, subtotal, deliveryFee, total })
    res.status(201).json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/orders
router.get('/', auth, async (req, res) => {
  try {
    if (useMock()) {
      const orders = getMockDb().getDb().orders.filter(o => o.user === req.userId).reverse()
      return res.json({ success: true, orders })
    }
    const Order = require('../models/Order')
    const orders = await Order.find({ user: req.userId }).populate('items.product').sort('-createdAt')
    res.json({ success: true, orders })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/orders/:id
router.get('/:id', auth, async (req, res) => {
  try {
    if (useMock()) {
      const order = getMockDb().getDb().orders.find(o => o._id === req.params.id && o.user === req.userId)
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
      return res.json({ success: true, order })
    }
    const Order = require('../models/Order')
    const order = await Order.findOne({ _id: req.params.id, user: req.userId }).populate('items.product')
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    res.json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
