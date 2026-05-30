const router = require('express').Router()

const useMock = () => process.env.USE_MOCK_DB === 'true'
const getMockDb = () => require('../config/mockDb')

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    if (useMock()) {
      return res.json({ success: true, categories: getMockDb().getDb().categories })
    }
    const Category = require('../models/Category')
    const categories = await Category.find({ isActive: true }).sort('order')
    res.json({ success: true, categories })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
