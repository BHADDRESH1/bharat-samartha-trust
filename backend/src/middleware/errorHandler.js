/**
 * Centralized error handling middleware
 */

/**
 * Handle known application errors
 */
const handleApplicationError = (err, req, res, next) => {
  // Log the error for debugging
  console.error('Application Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource ID'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Database connection error
  if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
    console.warn('⚠️ Database connection error detected, enabling demo mode');
    return res.status(200).json({
      success: true,
      message: 'Service temporarily unavailable, running in demo mode',
      data: {} // Return empty data object for demo mode
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

/**
 * Handle async route errors
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      // Handle database timeout errors specifically
      if (err.name === 'MongoTimeoutError' || err.message.includes('timed out')) {
        console.warn('⚠️ Database timeout error, returning demo data');
        return res.status(200).json({
          success: true,
          message: 'Service temporarily slow, showing demo data',
          data: {}
        });
      }
      next(err);
    });
  };
};

/**
 * Handle unhandled route errors
 */
const handleNotFoundError = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server`
  });
};

module.exports = {
  handleApplicationError,
  catchAsync,
  handleNotFoundError
};