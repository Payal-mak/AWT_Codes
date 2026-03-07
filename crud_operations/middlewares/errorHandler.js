/**
 * errorHandler.js — Centralized Express error-handling middleware.
 *
 * Handles both operational errors (AppError) and unexpected programming errors.
 * - Logs every error with timestamp, method, URL, status, and stack (dev only).
 * - Returns JSON for API / AJAX requests; renders error.ejs for browser requests.
 * - Masks 5xx internal details in production to avoid leaking implementation info.
 */

const AppError = require('./AppError');

// ─── Logger ──────────────────────────────────────────────────────────────────

function logError(err, req) {
    const ts = new Date().toISOString();
    const { method, originalUrl } = req;
    const status = err.statusCode || 500;

    console.error(`\n[${ts}] ERROR ${status} ${method} ${originalUrl}`);
    console.error(`  Message : ${err.message}`);

    if (err.details && err.details.length) {
        console.error(`  Details : ${JSON.stringify(err.details)}`);
    }

    // Only print full stack in development to keep production logs clean
    if (process.env.NODE_ENV !== 'production') {
        console.error(`  Stack   :\n${err.stack}`);
    }
}

// ─── Main Middleware ─────────────────────────────────────────────────────────

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    // Normalise non-AppError instances into a generic 500
    if (!(err instanceof AppError)) {
        // Log the raw unexpected error
        logError(err, req);

        const safeMessage =
            process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred. Please try again later.'
                : err.message;

        err = new AppError(safeMessage, err.statusCode || 500);
    } else {
        logError(err, req);
    }

    const { statusCode, message, timestamp, details, status } = err;

    // ── JSON response (API / fetch requests) ──────────────────────────────
    if (req.accepts('json') && !req.accepts('html')) {
        return res.status(statusCode).json({
            status,
            statusCode,
            message,
            timestamp,
            ...(details && details.length ? { details } : {})
        });
    }

    // ── HTML response (browser request) ──────────────────────────────────
    res.status(statusCode).render('error', {
        title: `Error ${statusCode}`,
        message,
        statusCode,
        timestamp,
        details: details || []
    });
}

module.exports = errorHandler;
