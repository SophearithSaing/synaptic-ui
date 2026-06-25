import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { AuthSessionService } from './auth-session.service';

/**
 * Allows access only when the client has authenticated user state.
 */
export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  if (authSession.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
