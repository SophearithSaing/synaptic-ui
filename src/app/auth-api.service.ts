import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

const API_BASE_URL = environment.API_BASE_URL;

interface AuthTokenResponse {
  readonly access_token: string;
}

interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

interface RegisterRequest extends LoginRequest {
  readonly username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  public constructor(private readonly http: HttpClient) {}

  /**
   * Sends user credentials to the login endpoint.
   *
   * @param request Login credentials from the login form.
   * @returns Observable containing an API access token.
   */
  public login(request: LoginRequest): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(
      `${API_BASE_URL}/auth/login`,
      request,
    );
  }

  /**
   * Sends new account details to the registration endpoint.
   *
   * @param request Registration details from the sign up form.
   * @returns Observable containing an API access token.
   */
  public register(request: RegisterRequest): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(
      `${API_BASE_URL}/auth/register`,
      request,
    );
  }
}
