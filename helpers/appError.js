class AppError extends Error {
  constructor(message, statusCode, status, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
