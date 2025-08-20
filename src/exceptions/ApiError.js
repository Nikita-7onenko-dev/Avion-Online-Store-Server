

export default class ApiError extends Error {

  constructor(status, message, errors = []) {
    super(message),
    this.status = status,
    this.errors = errors
  }

  static badRequest(message = 'Bad request', errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorizedError(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message ='Forbidden') {
    return new ApiError(403, message);
  }
  
  static notFound(message = 'Not found') {
    return new ApiError(404, message)
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message)
  }

  static serviceUnavailable(message = 'Service Unavailable') {
    return new ApiError(503, message)
  }
}