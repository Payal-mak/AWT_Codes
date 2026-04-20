const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const httpLogger = require('./presentation/middlewares/logger.middleware');
const logger = require('./infrastructure/logger/winston');

// Initialize express app
const app = express();

// Global Middlewares
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true }));

// Custom request logger
app.use(httpLogger);

// Example route for testing
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

// Import and use routes here 
// e.g. app.use('/api/v1/users', userRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
