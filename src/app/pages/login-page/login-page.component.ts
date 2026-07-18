import { Component, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import {
  SynBrandComponent,
  SynButtonComponent,
  SynFormFieldComponent,
  SynFormPanelComponent,
  SynInputComponent,
  SynTextLinkComponent,
} from '../../ui';

import { AuthApiService } from '../../auth-api.service';
import { AuthSessionService } from '../../auth-session.service';
import { mapAuthError } from '../../auth-error-mapping';
import { AuthenticatedUser } from '../../models/auth.models';

@Component({
  selector: 'app-login-page',
  imports: [
    SynBrandComponent,
    SynButtonComponent,
    SynFormFieldComponent,
    SynFormPanelComponent,
    SynInputComponent,
    SynTextLinkComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  public readonly errorMessage = signal<string | null>(null);
  public readonly submitting = signal(false);

  public constructor(
    private readonly authApi: AuthApiService,
    private readonly authSession: AuthSessionService,
    private readonly destroyRef: DestroyRef,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  /**
   * Authenticates the user and navigates to the signed-in home page.
   *
   * @param event Login form submit event.
   */
  public onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget;

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(form);
    const identifier = String(formData.get('identifier') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    this.errorMessage.set(null);
    this.submitting.set(true);
    this.authApi
      .login({ identifier, password })
      .pipe(
        switchMap((): Observable<AuthenticatedUser> => this.authApi.me()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (user: AuthenticatedUser): void => {
          this.authSession.signIn(user);
          void this.router.navigateByUrl(this.returnUrl());
        },
        error: (err: unknown): void => {
          this.errorMessage.set(mapAuthError(err));
          this.submitting.set(false);
        },
      });
  }

  /**
   * Returns the post-login destination from query params.
   *
   * @returns Safe post-login URL.
   */
  private returnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl === null || !returnUrl.startsWith('/')) {
      return '/home';
    }

    if (returnUrl.startsWith('//')) {
      return '/home';
    }

    return returnUrl;
  }
}
