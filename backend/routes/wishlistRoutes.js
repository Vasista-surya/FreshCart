const router = require('express').Router()
const { auth } = require('../middleware/auth')

const useMock = () => process.env.USE_MOCK_DB === 'true'
const getMockDb = () => require('../config/mockDb')

// GET /api/wishlist
router.get('/', auth, async (req, res) => {
  try {
    if (useMock()) {
      const db = getMockDb().getDb()
      const wl = db.wishlists.find(w => w.user === req.userId)
      const items = (wl?.items || []).map(i => ({
        product: db.products.find(p => p._id === i.productId) || {},
        productId: i.productId,
      }))
      return res.json({ success: true, items })
    }
    const Wishlist = require('../models/Wishlist')
    const wl = await Wishlist.findOne({ user: req.userId }).populate('items.product')
    res.json({ success: true, items: wl?.items || [] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body

    if (useMock()) {
      const db = getMockDb().getDb()
      let wl = db.wishlists.find(w => w.user === req.userId)
      if (!wl) { wl = { user: req.userId, items: [] }; db.wishlists.push(wl) }
      if (!wl.items.find(i => i.productId === productId)) {
        wl.items.push({ productId })
      }
      const items = wl.items.map(i => ({
        product: db.products.find(p => p._id === i.productId) || {},
        productId: i.productId,
      }))
      return res.json({ success: true, items })
    }

    const Wishlist = require('../models/Wishlist')
    let wl = await Wishlist.findOne({ user: req.userId })
    if (!wl) wl = new Wishlist({ user: req.userId, items: [] })
    if (!wl.items.find(i => i.product.toString() === productId)) {
      wl.items.push({ product: productId })
    }
    await wl.save()
    await wl.populate('items.product')
    res.json({ success: true, items: wl.items })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/wishlist/:productId
router.delete('/:productId', auth, async (req, res) => {
  try {
    if (useMock()) {
      const db = getMockDb().getDb()
      const wl = db.wishlists.find(w => w.user === req.userId)
      if (wl) wl.items = wl.items.filter(i => i.productId !== req.params.productId)
      const items = (wl?.items || []).map(i => ({
        product: db.products.find(p => p._id === i.productId) || {},
        productId: i.productId,
      }))
      return res.json({ success: true, items })
    }
    const Wishlist = require('../models/Wishlist')
    const wl = await Wishlist.findOne({ user: req.userId })
    if (wl) {
      wl.items = wl.items.filter(i => i.product.toString() !== req.params.productId)
      await wl.save()
      await wl.populate('items.product')
    }
    res.json({ success: true, items: wl?.items || [] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
