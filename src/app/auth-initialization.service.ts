import { Injectable } from '@angular/core';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  tap,
} from 'rxjs';

import { AuthApiService } from './auth-api.service';
import { AuthSessionService } from './auth-session.service';
import { AuthenticatedUser } from './models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthInitializationService {
  private initialization$: Observable<void> | null = null;

  public constructor(
    private readonly authApi: AuthApiService,
    private readonly authSession: AuthSessionService,
  ) {}

  /**
   * Resolves the first-load authentication state once per page load.
   *
   * @returns Observable completing when authentication state is known.
   */
  public initialize(): Observable<void> {
    if (this.authSession.hasInitialized()) {
      return of(undefined);
    }

    if (this.initialization$ !== null) {
      return this.initialization$;
    }

    this.initialization$ = this.authApi.me().pipe(
      tap((user: AuthenticatedUser): void => {
        this.authSession.signIn(user);
      }),
      catchError((): Observable<null> => {
        this.authSession.signOut();

        return of(null);
      }),
      tap((): void => {
        this.authSession.completeInitialization();
      }),
      map((): void => undefined),
      finalize((): void => {
        this.initialization$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.initialization$;
  }
}
