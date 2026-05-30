require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const wishlistRoutes = require('./routes/wishlistRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'FreshCart API is running',
    version: '1.0.0',
  })
})

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// Error handler
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    await connectDB()
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`🛒 FreshCart API running on port ${PORT}`)
      console.log(`📡 Mode: ${process.env.USE_MOCK_DB === 'true' ? 'Mock DB' : 'MongoDB'}`)
    })
  } catch (error) {
    console.error('💥 Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
