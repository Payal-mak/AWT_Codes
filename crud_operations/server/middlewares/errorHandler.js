const AppError = require('./AppError');

function logError(err, req) {
    const ts = new Date().toISOString();
    const { method, originalUrl } = req;
    const status = err.statusCode || 500;

    console.error(`\n[${ts}] ERROR ${status} ${method} ${originalUrl}`);
    console.error(`  Message : ${err.message}`);

    if (err.details && err.details.length) {
        console.error(`  Details : ${JSON.stringify(err.details)}`);
    }

    if (process.env.NODE_ENV !== 'production') {
        console.error(`  Stack   :\n${err.stack}`);
    }
}

function errorHandler(err, req, res, next) {
    if (!(err instanceof AppError)) {
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

    // Always return JSON (React frontend consumes JSON)
    res.status(statusCode).json({
        status,
        statusCode,
        message,
        timestamp,
        ...(details && details.length ? { details } : {})
    });
}

module.exports = errorHandler;
