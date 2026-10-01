// Centralized Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error('[SERVER ERROR]:', err.message);
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.PRODUCTION === 'true' ? null : err.stack,
  });
};

module.exports = { errorHandler };
