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
 * Allows access only to users with the administrator role.
 *
 * @param route Activated route snapshot.
 * @param state Router state snapshot for preserving the attempted URL.
 * @returns Guard decision or a redirect tree.
 */
export const adminGuard: CanActivateFn = (
  _route,
  state: RouterStateSnapshot,
): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authInitialization = inject(AuthInitializationService);
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  if (authSession.hasInitialized()) {
    return adminGuardDecision(authSession, router, state);
  }

  return authInitialization
    .initialize()
    .pipe(
      map((): boolean | UrlTree =>
        adminGuardDecision(authSession, router, state),
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

/**
 * Resolves the administrator route access decision for the current session.
 *
 * @param authSession Current authentication session state.
 * @param router Application router.
 * @param state Router state for preserving an unauthenticated attempted URL.
 * @returns Allow decision or redirect tree.
 */
function adminGuardDecision(
  authSession: AuthSessionService,
  router: Router,
  state: RouterStateSnapshot,
): boolean | UrlTree {
  if (!authSession.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: {
        returnUrl: state.url,
      },
    });
  }

  return authSession.user()?.role === 'admin'
    ? true
    : router.createUrlTree(['/home']);
}
