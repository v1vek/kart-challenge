class ApiError extends Error {
  constructor(statusCode, type, message, isOperational = true, stack = '') {
    super(message);

    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
