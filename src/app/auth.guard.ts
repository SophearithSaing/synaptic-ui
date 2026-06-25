import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { AuthApiService } from './auth-api.service';
import { AuthSessionService } from './auth-session.service';
import { AuthenticatedUser } from './models/auth.models';

/**
 * Allows access only when the API confirms an authenticated user.
 *
 * @param route Activated route snapshot.
 * @param state Router state snapshot for preserving the attempted URL.
 * @returns Guard decision or login redirect tree.
 */
export const authGuard: CanActivateFn = (
  _route,
  state: RouterStateSnapshot,
): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authApi = inject(AuthApiService);
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  if (authSession.isAuthenticated()) {
    return true;
  }

  return authApi.me().pipe(
    tap((user: AuthenticatedUser): void => {
      authSession.signIn(user);
    }),
    map((): boolean => true),
    catchError(
      (): Observable<UrlTree> =>
        of(
          router.createUrlTree(['/login'], {
            queryParams: {
              returnUrl: state.url,
            },
          }),
        ),
    ),
  );
};

/**
 * Allows access only for users without an authenticated API session.
 *
 * @returns Guard decision or home redirect tree.
 */
export const unauthGuard: CanActivateFn = ():
  | boolean
  | UrlTree
  | Observable<boolean | UrlTree> => {
  const authApi = inject(AuthApiService);
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  if (authSession.isAuthenticated()) {
    return router.createUrlTree(['/home']);
  }

  return authApi.me().pipe(
    tap((user: AuthenticatedUser): void => {
      authSession.signIn(user);
    }),
    map((): UrlTree => router.createUrlTree(['/home'])),
    catchError((): Observable<boolean> => of(true)),
  );
};
