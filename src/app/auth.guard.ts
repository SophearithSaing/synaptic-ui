import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthInitializationService } from './auth-initialization.service';
import { AuthSessionService } from './auth-session.service';

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
  const authInitialization = inject(AuthInitializationService);
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  if (authSession.hasInitialized()) {
    return authSession.isAuthenticated()
      ? true
      : router.createUrlTree(['/login'], {
          queryParams: {
            returnUrl: state.url,
          },
        });
  }

  return authInitialization.initialize().pipe(
    map((): boolean | UrlTree =>
      authSession.isAuthenticated()
        ? true
        : router.createUrlTree(['/login'], {
            queryParams: {
              returnUrl: state.url,
            },
          }),
    ),
  );
};

/**
 * Allows access only for users without an authenticated API session.
 *
 * @returns Guard decision or home redirect tree.
 */
export const unauthGuard: CanActivateFn = ():
  boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authInitialization = inject(AuthInitializationService);
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  if (authSession.hasInitialized()) {
    return authSession.isAuthenticated()
      ? router.createUrlTree(['/home'])
      : true;
  }

  return authInitialization
    .initialize()
    .pipe(
      map((): boolean | UrlTree =>
        authSession.isAuthenticated() ? router.createUrlTree(['/home']) : true,
      ),
    );
};
