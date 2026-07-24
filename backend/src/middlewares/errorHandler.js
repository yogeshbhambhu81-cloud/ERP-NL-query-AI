import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${req.method} ${req.url} - Status ${statusCode} - ${message}`);
  if (err.stack && env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Consistent API JSON Response format
  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    errors: err.errors || [],
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
