import { Injectable, signal } from '@angular/core';

import { AuthenticatedUser } from './models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  public readonly user = signal<AuthenticatedUser | null>(null);

  /**
   * Stores the current authenticated user in client state.
   *
   * @param user Current authenticated user returned by the API.
   */
  public signIn(user: AuthenticatedUser): void {
    this.user.set(user);
  }

  /**
   * Clears the local authenticated user state.
   */
  public signOut(): void {
    this.user.set(null);
  }

  /**
   * Reports whether the current client state has an authenticated user.
   *
   * @returns True when the current client state has an authenticated user.
   */
  public isAuthenticated(): boolean {
    return this.user() !== null;
  }
}
