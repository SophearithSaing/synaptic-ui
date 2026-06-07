import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly tokenStorageKey = 'synaptic.accessToken';

  public readonly accessToken = signal<string | null>(this.readAccessToken());

  /**
   * Stores the API access token for the authenticated session.
   *
   * @param accessToken API bearer token returned by authentication.
   */
  public signIn(accessToken: string): void {
    this.accessToken.set(accessToken);
    localStorage.setItem(this.tokenStorageKey, accessToken);
  }

  /**
   * Clears the local authenticated session.
   */
  public signOut(): void {
    this.accessToken.set(null);
    localStorage.removeItem(this.tokenStorageKey);
  }

  /**
   * Reports whether the current session has an API access token.
   *
   * @returns True when the current session has an API access token.
   */
  public isAuthenticated(): boolean {
    return this.accessToken() !== null;
  }

  /**
   * Reads a persisted API access token when real authentication has occurred.
   *
   * @returns Persisted API access token, or null when none exists.
   */
  private readAccessToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }
}
