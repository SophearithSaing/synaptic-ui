import { Injectable, signal } from '@angular/core';

import { AuthenticatedUser } from './models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  public readonly initialized = signal(false);
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
   * Marks the first-load authentication check as complete.
   */
  public completeInitialization(): void {
    this.initialized.set(true);
  }

  /**
   * Reports whether the first-load authentication check has completed.
   *
   * @returns True when initial authentication state is known.
   */
  public hasInitialized(): boolean {
    return this.initialized();
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
