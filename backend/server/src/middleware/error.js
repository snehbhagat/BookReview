function errorHandler(err, req, res, next) {
  // In production you might not want to leak error details
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
}

module.exports = { errorHandler };
