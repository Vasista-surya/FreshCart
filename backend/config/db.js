const mongoose = require('mongoose');

// Disable query buffering globally so disconnected queries fail instantly instead of hanging
mongoose.set('bufferCommands', false);

// Setup robust Mongoose connection event monitoring
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose default connection open to DB');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose default connection disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 Mongoose connection successfully re-established.');
});

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables (.env)');
    }
    
    console.log('🔌 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 4000, // Timeout after 4 seconds
      socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
      family: 4,                      // Force IPv4 to prevent slow localhost resolution on Windows
    });
    
    console.log(`📡 MongoDB Connected Successfully: ${conn.connection.host}`);
    process.env.USE_MOCK_DB = 'false';
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.warn('⚠️ MongoDB is offline. Activating local mock database fallback...');
    process.env.USE_MOCK_DB = 'true';
    
    // Return a mock connection object to allow server startup sequence to continue
    return {
      connection: {
        host: 'Mock Local DB Fallback (db.json)',
      }
    };
  }
};

module.exports = connectDB;

