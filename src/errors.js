class AppError extends Error {
 constructor(message, status = 500, code = 'app_error') {
 super(message);
 this.status = status;
 this.code = code;
 }
}

class NotFoundError extends AppError {
 constructor(message = 'not found') {
 super(message, 404, 'not_found');
 }
}

class BadRequestError extends AppError {
 constructor(message = 'bad request') {
 super(message, 400, 'bad_request');
 }
}

class ConflictError extends AppError {
 constructor(message = 'conflict') {
 super(message, 409, 'conflict');
 }
}

class RateLimitError extends AppError {
 constructor(message = 'rate limited') {
 super(message, 429, 'rate_limited');
 }
}

class ConfigError extends AppError {
 constructor(message = 'configuration error') {
 super(message, 500, 'config_error');
 }
}

function toAppError(err) {
 if (err instanceof AppError) return err;
 const wrapped = new AppError(err.message || 'internal error');
 wrapped.cause = err;
 return wrapped;
}

module.exports = { AppError, NotFoundError, BadRequestError, ConflictError, RateLimitError, ConfigError, toAppError };