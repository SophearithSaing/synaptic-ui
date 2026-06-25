import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AuthenticatedResponse,
  AuthenticatedUser,
  LoginRequest,
  RegisterRequest,
} from './models/auth.models';
import { environment } from '../environments/environment';

const API_BASE_URL = environment.API_BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  public constructor(private readonly http: HttpClient) {}

  /**
   * Sends user credentials to the login endpoint.
   *
   * @param request Login credentials from the login form.
   * @returns Observable confirming cookie-backed authentication.
   */
  public login(request: LoginRequest): Observable<AuthenticatedResponse> {
    return this.http.post<AuthenticatedResponse>(
      `${API_BASE_URL}/auth/login`,
      request,
    );
  }

  /**
   * Sends new account details to the registration endpoint.
   *
   * @param request Registration details from the sign up form.
   * @returns Observable confirming cookie-backed authentication.
   */
  public register(request: RegisterRequest): Observable<AuthenticatedResponse> {
    return this.http.post<AuthenticatedResponse>(
      `${API_BASE_URL}/auth/register`,
      request,
    );
  }

  /**
   * Loads the current authenticated user.
   *
   * @returns Observable containing the current authenticated user.
   */
  public me(): Observable<AuthenticatedUser> {
    return this.http.get<AuthenticatedUser>(`${API_BASE_URL}/auth/me`);
  }

  /**
   * Refreshes the cookie-backed authenticated session.
   *
   * @returns Observable confirming renewed authentication.
   */
  public refresh(): Observable<AuthenticatedResponse> {
    return this.http.post<AuthenticatedResponse>(
      `${API_BASE_URL}/auth/refresh`,
      {},
    );
  }

  /**
   * Revokes the current refresh session and clears auth cookies.
   *
   * @returns Observable completing when logout succeeds.
   */
  public logout(): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/auth/logout`, {});
  }
}
