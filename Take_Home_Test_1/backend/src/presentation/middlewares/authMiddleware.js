const jwt = require('jsonwebtoken');
const logger = require('../../infrastructure/logging/logger');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    logger.warn('No token provided.');
    return res.status(401).json({ error: 'Access denied.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(`User ${req.user.id} without required role ${roles}`);
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };