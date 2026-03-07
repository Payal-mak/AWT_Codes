/**
 * AppError — Custom operational error class.
 *
 * Usage:
 *   throw new AppError('Item not found', 404);
 *   next(new AppError('Validation failed', 422, errors));
 *
 * Properties:
 *   - message      {string}  Human-readable description
 *   - statusCode   {number}  HTTP status code (default 500)
 *   - isOperational{boolean} Always true — distinguishes expected errors from bugs
 *   - timestamp    {string}  ISO-8601 creation time
 *   - details      {Array}   Optional field-level validation errors
 */
class AppError extends Error {
    /**
     * @param {string}   message     Error message shown to the user/API consumer
     * @param {number}   [statusCode=500]  HTTP status code
     * @param {Array}    [details=[]]      Optional array of field-level error objects
     */
    constructor(message, statusCode = 500, details = []) {
        super(message);

        this.statusCode  = statusCode;
        this.status      = String(statusCode).startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;          // Flag for the error handler
        this.timestamp   = new Date().toISOString();
        this.details     = details;         // e.g. [{ field: 'name', msg: 'required' }]

        // Preserve the correct stack trace (V8 only, safe to call conditionally)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = AppError;
