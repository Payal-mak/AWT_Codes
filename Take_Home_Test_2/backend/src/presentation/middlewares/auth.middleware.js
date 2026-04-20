const jwt = require('jsonwebtoken');
const logger = require('../../infrastructure/logger/winston');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Auth Middleware: Unauthorized access attempt to ${req.originalUrl}`);
    return res.status(401).json({ success: false, message: 'Access Denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    const decoded = jwt.verify(token, secret);
    
    // Attach decoded user payload to request
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Auth Middleware: Invalid token applied for ${req.originalUrl} - ${error.message}`);
    return res.status(401).json({ success: false, message: 'Access Denied: Invalid or expired token' });
  }
};

module.exports = authMiddleware;
