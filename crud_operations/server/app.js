require('dotenv').config();

const express = require('express');
const cors = require('cors');

const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./middlewares/AppError');

const app = express();
const PORT = process.env.PORT || 5000;

// Process-level error guards
process.on('uncaughtException', (err) => {
    console.error(`[${new Date().toISOString()}] UNCAUGHT EXCEPTION`);
    console.error(err.name, err.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error(`[${new Date().toISOString()}] UNHANDLED REJECTION`);
    console.error(reason);
    process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);

// 404 handler
app.use((req, res, next) => {
    next(new AppError(`Cannot ${req.method} ${req.originalUrl} — not found`, 404));
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Server running on http://localhost:${PORT}`);
});

module.exports = app;
