const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect middleware — validates JWT from Authorization header and sets req.user.
 * Returns 401 Unauthorized if token is missing, expired, or invalid.
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token
      const secret = process.env.JWT_SECRET || 'fallback_secret_key_leadcrm_default_5e8837e';
      const decoded = jwt.verify(token, secret);

      // Fetch user from database and append to request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
        });
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token verification failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

module.exports = { protect };
