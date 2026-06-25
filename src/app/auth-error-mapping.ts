import { HttpErrorResponse } from '@angular/common/http';

/**
 * Maps an HTTP error to a user-friendly message.
 *
 * @param error HTTP error response from the API.
 * @returns User-friendly error message.
 */
export function mapAuthError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'An unexpected error occurred. Please try again.';
  }

  switch (error.status) {
    case 401:
      return 'Unable to log in with those credentials.';
    case 403:
      return mapForbiddenError(error);
    case 409:
      return mapConflictError(error);
    case 429:
      return 'Too many attempts. Please wait before trying again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Maps a 403 error to a user-friendly message.
 *
 * @param error HTTP error response.
 * @returns User-friendly message for 403 errors.
 */
function mapForbiddenError(error: HttpErrorResponse): string {
  const message = extractErrorMessage(error);

  if (message?.includes('csrf')) {
    return 'Security session expired. Please refresh and try again.';
  }

  return 'Access denied. Please try again.';
}

/**
 * Maps a 409 error to a user-friendly message.
 *
 * @param error HTTP error response.
 * @returns User-friendly message for 409 errors.
 */
function mapConflictError(error: HttpErrorResponse): string {
  const message = extractErrorMessage(error);

  if (message?.includes('email')) {
    return 'An account with that email already exists.';
  }

  if (message?.includes('username')) {
    return 'That username is already taken.';
  }

  return 'Those details are already in use.';
}

/**
 * Extracts a lowercase error message string from the response body.
 *
 * @param error HTTP error response.
 * @returns Lowercase message string, or null when unavailable.
 */
function extractErrorMessage(error: HttpErrorResponse): string | null {
  const body = error.error;

  if (typeof body === 'string') {
    return body.toLowerCase();
  }

  if (body && typeof body === 'object') {
    const message = body.message ?? body.error;

    if (typeof message === 'string') {
      return message.toLowerCase();
    }
  }

  return null;
}
