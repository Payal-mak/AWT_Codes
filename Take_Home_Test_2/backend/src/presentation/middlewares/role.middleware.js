const logger = require('../../infrastructure/logger/winston');

const requireRole = (role) => {
  return (req, res, next) => {
    // req.user should be populated by authMiddleware before this middleware
    if (!req.user) {
      logger.warn(`Role Middleware: Access denied - No authenticated user data found on ${req.originalUrl}`);
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (req.user.role !== role) {
      logger.warn(`Role Middleware: Access denied for user ${req.user.email} (Role: ${req.user.role}) trying to access ${req.originalUrl} requiring ${role}`);
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = requireRole;
