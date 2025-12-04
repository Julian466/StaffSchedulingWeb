/**
 * Base class for repository-specific errors.
 * Extends the standard Error class with HTTP status code support.
 */
export class RepositoryError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when attempting to create a resource that already exists.
 * Returns HTTP 409 (Conflict) status code.
 */
export class DuplicateResourceError extends RepositoryError {
  constructor(message: string) {
    super(message, 409);
  }
}

/**
 * Error thrown when a requested resource is not found.
 * Returns HTTP 404 (Not Found) status code.
 */
export class ResourceNotFoundError extends RepositoryError {
  constructor(message: string) {
    super(message, 404);
  }
}

/**
 * Error thrown when request data is invalid.
 * Returns HTTP 400 (Bad Request) status code.
 */
export class ValidationError extends RepositoryError {
  constructor(message: string) {
    super(message, 400);
  }
}

/**
 * Type guard to check if an error is a RepositoryError
 */
export function isRepositoryError(error: unknown): error is RepositoryError {
  return error instanceof RepositoryError;
}
