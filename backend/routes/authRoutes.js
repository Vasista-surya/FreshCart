const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { auth } = require('../middleware/auth')

const useMock = () => process.env.USE_MOCK_DB === 'true'
const getMockDb = () => require('../config/mockDb')

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required' })
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })

    if (useMock()) {
      const { getDb, genId } = getMockDb()
      const db = getDb()
      if (db.users.find(u => u.email === email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'Email already registered' })
      }
      const salt = bcrypt.genSaltSync(10)
      const user = {
        _id: genId(),
        name,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, salt),
        role: 'user',
        createdAt: new Date().toISOString(),
      }
      db.users.push(user)
      const token = generateToken(user)
      return res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
    }

    const User = require('../models/User')
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' })

    const user = await User.create({ name, email: email.toLowerCase(), password })
    const token = generateToken(user)
    res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' })

    if (useMock()) {
      const { getDb } = getMockDb()
      const user = getDb().users.find(u => u.email === email.toLowerCase())
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' })
      }
      const token = generateToken(user)
      return res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
    }

    const User = require('../models/User')
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }
    const token = generateToken(user)
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/auth/profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (useMock()) {
      const user = getMockDb().getDb().users.find(u => u._id === req.userId)
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      return res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
    }
    const User = require('../models/User')
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
