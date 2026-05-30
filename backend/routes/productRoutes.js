const router = require('express').Router()

const useMock = () => process.env.USE_MOCK_DB === 'true'
const getMockDb = () => require('../config/mockDb')

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query

    if (useMock()) {
      let products = [...getMockDb().getDb().products]
      if (category) products = products.filter(p => p.category === category)
      if (search) {
        const q = search.toLowerCase()
        products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q))
      }
      if (sort) {
        const desc = sort.startsWith('-')
        const field = desc ? sort.slice(1) : sort
        products.sort((a, b) => {
          if (typeof a[field] === 'string') return desc ? b[field].localeCompare(a[field]) : a[field].localeCompare(b[field])
          return desc ? b[field] - a[field] : a[field] - b[field]
        })
      }
      return res.json({ success: true, products, total: products.length })
    }

    const Product = require('../models/Product')
    let query = {}
    if (category) query.category = category
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ]
    let sortObj = {}
    if (sort) {
      const desc = sort.startsWith('-')
      sortObj[desc ? sort.slice(1) : sort] = desc ? -1 : 1
    }
    const products = await Product.find(query).sort(sortObj)
    res.json({ success: true, products, total: products.length })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  try {
    if (useMock()) {
      const products = getMockDb().getDb().products.filter(p => p.isFeatured)
      return res.json({ success: true, products })
    }
    const Product = require('../models/Product')
    const products = await Product.find({ isFeatured: true }).limit(12)
    res.json({ success: true, products })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/products/search
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.json({ success: true, products: [] })

    if (useMock()) {
      const query = q.toLowerCase()
      const products = getMockDb().getDb().products.filter(p =>
        p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.brand?.toLowerCase().includes(query)
      ).slice(0, 10)
      return res.json({ success: true, products })
    }
    const Product = require('../models/Product')
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
      ]
    }).limit(10)
    res.json({ success: true, products })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    if (useMock()) {
      const product = getMockDb().getDb().products.find(p => p._id === req.params.id)
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
      return res.json({ success: true, product })
    }
    const Product = require('../models/Product')
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
