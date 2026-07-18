import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  catchError,
  finalize,
  Observable,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { AuthSessionService } from './auth-session.service';
import { CsrfService } from './csrf.service';
import { environment } from '../environments/environment';

const API_BASE_URL = environment.API_BASE_URL;
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

let refreshRequest$: Observable<unknown> | null = null;

/**
 * Adds API credentials, CSRF headers, and refresh retry handling.
 *
 * @param request Outgoing HTTP request.
 * @param next Next HTTP handler.
 * @returns Observable of the HTTP event stream.
 */
export const authHttpInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authSession = inject(AuthSessionService);
  const csrfService = inject(CsrfService);
  const httpBackend = inject(HttpBackend);
  const apiRequest = withApiCredentials(request);

  return sendApiRequest(apiRequest, next, csrfService).pipe(
    catchError((error: unknown): Observable<HttpEvent<unknown>> =>
      handleAuthError(
        error,
        apiRequest,
        next,
        csrfService,
        httpBackend,
        authSession,
      ),
    ),
  );
};

/**
 * Sends an API request with a CSRF token when required.
 *
 * @param request Request to send.
 * @param next Next HTTP handler.
 * @param csrfService Service that provides CSRF tokens.
 * @returns Observable of the HTTP event stream.
 */
function sendApiRequest(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  csrfService: CsrfService,
): Observable<HttpEvent<unknown>> {
  if (!isApiRequest(request) || !requiresCsrf(request)) {
    return next(request);
  }

  return csrfService
    .token()
    .pipe(
      switchMap((token: string): Observable<HttpEvent<unknown>> =>
        next(withCsrfToken(request, token)),
      ),
    );
}

/**
 * Handles authentication failures with one refresh attempt.
 *
 * @param error Error returned by the HTTP pipeline.
 * @param request Original outgoing request.
 * @param next Next HTTP handler.
 * @param csrfService Service that provides CSRF tokens.
 * @param httpBackend Backend used to bypass interceptors for refresh.
 * @param authSession Current auth session service.
 * @returns Retried request stream or an error stream.
 */
function handleAuthError(
  error: unknown,
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  csrfService: CsrfService,
  httpBackend: HttpBackend,
  authSession: AuthSessionService,
): Observable<HttpEvent<unknown>> {
  if (!shouldRefresh(error, request)) {
    return throwError((): unknown => error);
  }

  return refreshSession(csrfService, httpBackend).pipe(
    catchError((refreshError: unknown): Observable<never> => {
      csrfService.clear();
      authSession.signOut();

      return throwError((): unknown => refreshError);
    }),
    switchMap((): Observable<HttpEvent<unknown>> =>
      sendApiRequest(request, next, csrfService),
    ),
  );
}

/**
 * Attempts to refresh the cookie-backed API session.
 *
 * @param csrfService Service that provides CSRF tokens.
 * @param httpBackend Backend used to bypass interceptors.
 * @returns Observable completing when refresh succeeds.
 */
function refreshSession(
  csrfService: CsrfService,
  httpBackend: HttpBackend,
): Observable<unknown> {
  if (refreshRequest$ !== null) {
    return refreshRequest$;
  }

  const http = new HttpClient(httpBackend);

  csrfService.clear();

  refreshRequest$ = csrfService.token().pipe(
    switchMap((token: string): Observable<unknown> =>
      http.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        {
          headers: {
            'X-CSRF-Token': token,
          },
          withCredentials: true,
        },
      ),
    ),
    tap((): void => {
      csrfService.clear();
    }),
    finalize((): void => {
      refreshRequest$ = null;
    }),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  return refreshRequest$;
}

/**
 * Adds browser credentials to API requests.
 *
 * @param request Outgoing HTTP request.
 * @returns Request with credentials enabled when it targets the API.
 */
function withApiCredentials(
  request: HttpRequest<unknown>,
): HttpRequest<unknown> {
  if (!isApiRequest(request)) {
    return request;
  }

  return request.clone({
    withCredentials: true,
  });
}

/**
 * Adds a CSRF token header to a request.
 *
 * @param request Request requiring CSRF protection.
 * @param token CSRF token value.
 * @returns Request with CSRF header attached.
 */
function withCsrfToken(
  request: HttpRequest<unknown>,
  token: string,
): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      'X-CSRF-Token': token,
    },
  });
}

/**
 * Reports whether a request targets the configured API.
 *
 * @param request Request to inspect.
 * @returns True when the request targets the API.
 */
function isApiRequest(request: HttpRequest<unknown>): boolean {
  return request.url.startsWith(API_BASE_URL);
}

/**
 * Reports whether a request requires CSRF protection.
 *
 * @param request Request to inspect.
 * @returns True when the request uses a mutating HTTP method.
 */
function requiresCsrf(request: HttpRequest<unknown>): boolean {
  return MUTATING_METHODS.has(request.method.toUpperCase());
}

/**
 * Reports whether an error should trigger session refresh.
 *
 * @param error Error returned by the HTTP pipeline.
 * @param request Request that failed.
 * @returns True when the request can attempt refresh.
 */
function shouldRefresh(error: unknown, request: HttpRequest<unknown>): boolean {
  return (
    error instanceof HttpErrorResponse &&
    error.status === 401 &&
    isApiRequest(request) &&
    !request.url.endsWith('/auth/login') &&
    !request.url.endsWith('/auth/register') &&
    !request.url.endsWith('/auth/refresh')
  );
}
