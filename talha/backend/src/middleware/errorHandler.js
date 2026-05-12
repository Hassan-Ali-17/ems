const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  if (err.name === 'CastError') {
    return res.status(404).json({ success: false, message: `Resource not found with id: ${err.value}` });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists.` });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((item) => item.message).join('. ');
    return res.status(400).json({ success: false, message: messages });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;