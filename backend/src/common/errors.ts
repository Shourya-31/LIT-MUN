export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const invalidRequest = (message = 'Please check the submitted information', details?: unknown) =>
  new ApiError(400, 'VALIDATION_ERROR', message, details);

export const unauthorized = (message = 'Authentication is required') =>
  new ApiError(401, 'UNAUTHENTICATED', message);

export const forbidden = (message = 'You do not have permission to perform this action') =>
  new ApiError(403, 'FORBIDDEN', message);

export const notFound = (message = 'The requested resource was not found') =>
  new ApiError(404, 'NOT_FOUND', message);

export const conflict = (message: string) => new ApiError(409, 'CONFLICT', message);
