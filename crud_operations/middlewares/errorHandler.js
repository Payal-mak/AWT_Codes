// Global error handling middleware
function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).render('error', {
        title: 'Error',
        message: message
    });
}

module.exports = errorHandler;
