const mongoose = require('mongoose')

mongoose.set('bufferCommands', false)

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not defined in .env')
    }
    console.log('🔌 Connecting to MongoDB...')
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 4000,
      socketTimeoutMS: 45000,
      family: 4,
    })
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`)
    process.env.USE_MOCK_DB = 'false'
    return conn
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`)
    console.warn('⚠️  Activating mock database fallback...')
    process.env.USE_MOCK_DB = 'true'
    const mockDb = require('./mockDb')
    mockDb.initialize()
    return { connection: { host: 'MockDB (in-memory)' } }
  }
}

module.exports = connectDB
