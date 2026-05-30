const router = require('express').Router()
const { auth } = require('../middleware/auth')

const useMock = () => process.env.USE_MOCK_DB === 'true'
const getMockDb = () => require('../config/mockDb')

// GET /api/cart
router.get('/', auth, async (req, res) => {
  try {
    if (useMock()) {
      const db = getMockDb().getDb()
      const cart = db.carts.find(c => c.user === req.userId)
      if (!cart) return res.json({ success: true, items: [] })
      const items = cart.items.map(i => ({
        product: db.products.find(p => p._id === i.productId) || { _id: i.productId, name: 'Unknown', price: 0, image: '' },
        quantity: i.quantity,
      }))
      return res.json({ success: true, items })
    }
    const Cart = require('../models/Cart')
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product')
    res.json({ success: true, items: cart?.items || [] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/cart
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    if (useMock()) {
      const db = getMockDb().getDb()
      let cart = db.carts.find(c => c.user === req.userId)
      if (!cart) { cart = { user: req.userId, items: [] }; db.carts.push(cart) }
      const existing = cart.items.find(i => i.productId === productId)
      if (existing) existing.quantity += quantity
      else cart.items.push({ productId, quantity })
      const items = cart.items.map(i => ({
        product: db.products.find(p => p._id === i.productId) || {},
        quantity: i.quantity,
      }))
      return res.json({ success: true, items })
    }

    const Cart = require('../models/Cart')
    let cart = await Cart.findOne({ user: req.userId })
    if (!cart) cart = new Cart({ user: req.userId, items: [] })
    const idx = cart.items.findIndex(i => i.product.toString() === productId)
    if (idx > -1) cart.items[idx].quantity += quantity
    else cart.items.push({ product: productId, quantity })
    await cart.save()
    await cart.populate('items.product')
    res.json({ success: true, items: cart.items })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/cart/:productId
router.put('/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body

    if (useMock()) {
      const db = getMockDb().getDb()
      const cart = db.carts.find(c => c.user === req.userId)
      if (cart) {
        const item = cart.items.find(i => i.productId === req.params.productId)
        if (item) item.quantity = quantity
      }
      const items = (cart?.items || []).map(i => ({
        product: db.products.find(p => p._id === i.productId) || {},
        quantity: i.quantity,
      }))
      return res.json({ success: true, items })
    }

    const Cart = require('../models/Cart')
    const cart = await Cart.findOne({ user: req.userId })
    if (cart) {
      const item = cart.items.find(i => i.product.toString() === req.params.productId)
      if (item) item.quantity = quantity
      await cart.save()
      await cart.populate('items.product')
    }
    res.json({ success: true, items: cart?.items || [] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/cart/:productId
router.delete('/:productId', auth, async (req, res) => {
  try {
    if (useMock()) {
      const db = getMockDb().getDb()
      const cart = db.carts.find(c => c.user === req.userId)
      if (cart) cart.items = cart.items.filter(i => i.productId !== req.params.productId)
      const items = (cart?.items || []).map(i => ({
        product: db.products.find(p => p._id === i.productId) || {},
        quantity: i.quantity,
      }))
      return res.json({ success: true, items })
    }
    const Cart = require('../models/Cart')
    const cart = await Cart.findOne({ user: req.userId })
    if (cart) {
      cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId)
      await cart.save()
      await cart.populate('items.product')
    }
    res.json({ success: true, items: cart?.items || [] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/cart
router.delete('/', auth, async (req, res) => {
  try {
    if (useMock()) {
      const db = getMockDb().getDb()
      const idx = db.carts.findIndex(c => c.user === req.userId)
      if (idx > -1) db.carts.splice(idx, 1)
      return res.json({ success: true, items: [] })
    }
    const Cart = require('../models/Cart')
    await Cart.findOneAndDelete({ user: req.userId })
    res.json({ success: true, items: [] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
