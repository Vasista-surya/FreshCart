/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('💥 Backend Error Intercepted:', err);
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Mongoose connection, timeout, buffering, or network errors
  if (
    err.name === 'MongooseError' ||
    err.name === 'MongoNetworkError' ||
    err.message.includes('buffering') ||
    err.message.includes('timeout') ||
    err.message.includes('connection') ||
    err.message.includes('topology')
  ) {
    statusCode = 503;
    message = 'Database connection failed. Please ensure MongoDB is running and your MONGO_URI is correct.';
  }

  // Mongoose CastError — invalid ObjectId
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found — invalid ID format';
  }

  // Mongoose duplicate key error
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate value entered for ${field}`;
  }

  // Mongoose ValidationError
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;

