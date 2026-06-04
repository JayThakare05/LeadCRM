/**
 * Global Error Handler Middleware
 * Catches all errors forwarded via next(error) from controllers.
 * Handles Mongoose validation errors and duplicate key errors specially.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose Validation Error ─────────────────────────────────────────────
  // e.g. required field missing or enum value invalid
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(', ');
  }

  // ── Mongoose Duplicate Key Error ──────────────────────────────────────────
  // e.g. email already exists (unique index violation)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `A lead with this ${field} already exists`;
  }

  // ── Mongoose CastError (invalid ObjectId) ────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
