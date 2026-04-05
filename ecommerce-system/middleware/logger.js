// ============================================================
// Q3 - middleware/logger.js
// Custom request logging middleware.
// Logs method, URL, status, and response time for every request.
// ============================================================

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${method} ${url} ${res.statusCode} ${duration}ms - IP: ${ip}`;
    console.log(log);
  });

  next();
};

module.exports = { requestLogger };
