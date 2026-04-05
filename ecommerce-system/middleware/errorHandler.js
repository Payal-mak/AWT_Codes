// ============================================================
// Q3 - middleware/errorHandler.js
// Custom error classes + global error handling middleware.
// AppError is the base class; specific errors extend it.
// globalErrorHandler catches all errors passed via next(err).
// ============================================================

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// Global error handling middleware (must have 4 params)
const globalErrorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // express-validator errors
  if (err.array) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.array(),
    });
  }

  // Generic/unexpected errors
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  globalErrorHandler,
};
