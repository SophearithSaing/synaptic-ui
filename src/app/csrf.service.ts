import { HttpClient, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, map, Observable, of, tap } from 'rxjs';

import { environment } from '../environments/environment';

const API_BASE_URL = environment.API_BASE_URL;

interface CsrfResponse {
  readonly csrf_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class CsrfService {
  private readonly http: HttpClient;
  private csrfToken: string | null = null;
  private csrfRequest: Observable<string> | null = null;

  public constructor(httpBackend: HttpBackend) {
    this.http = new HttpClient(httpBackend);
  }

  /**
   * Returns the current CSRF token, requesting one when missing.
   *
   * @returns Observable containing a CSRF token.
   */
  public token(): Observable<string> {
    if (this.csrfToken !== null) {
      return of(this.csrfToken);
    }

    if (this.csrfRequest !== null) {
      return this.csrfRequest;
    }

    this.csrfRequest = this.http
      .get<CsrfResponse>(`${API_BASE_URL}/auth/csrf`, {
        withCredentials: true,
      })
      .pipe(
        map((response: CsrfResponse): string => response.csrf_token),
        tap((token: string): void => {
          this.csrfToken = token;
        }),
        finalize((): void => {
          this.csrfRequest = null;
        }),
      );

    return this.csrfRequest;
  }

  /**
   * Clears the cached CSRF token.
   */
  public clear(): void {
    this.csrfToken = null;
    this.csrfRequest = null;
  }
}
