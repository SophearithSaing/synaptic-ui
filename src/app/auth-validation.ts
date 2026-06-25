/**
 * Validates a username against API rules.
 *
 * @param username Username to validate.
 * @returns Error message when invalid, or null when valid.
 */
export function validateUsername(username: string): string | null {
  if (username.length < 3) {
    return 'Username must be at least 3 characters.';
  }

  if (username.length > 32) {
    return 'Username must be at most 32 characters.';
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    return 'Username can only contain letters, numbers, underscores, periods, and hyphens.';
  }

  return null;
}

/**
 * Validates a password against API rules.
 *
 * @param password Password to validate.
 * @returns Error message when invalid, or null when valid.
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (password.length > 72) {
    return 'Password must be at most 72 characters.';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number.';
  }

  return null;
}

/**
 * Validates an email address format.
 *
 * @param email Email address to validate.
 * @returns Error message when invalid, or null when valid.
 */
export function validateEmail(email: string): string | null {
  if (email.length === 0) {
    return 'Email is required.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Enter a valid email address.';
  }

  return null;
}
