export interface AuthenticatedResponse {
  readonly authenticated: true;
}

export interface AuthenticatedUser {
  readonly email: string;
  readonly username: string;
  readonly userId: string;
  readonly role: 'user' | 'admin';
}

export interface LoginRequest {
  readonly identifier: string;
  readonly password: string;
}

export interface RegisterRequest {
  readonly username: string;
  readonly email: string;
  readonly password: string;
}
