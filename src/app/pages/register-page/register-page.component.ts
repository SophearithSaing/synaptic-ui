import {
  Component,
  DestroyRef,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import {
  SynButtonComponent,
  SynFooterComponent,
  SynFormFieldComponent,
  SynFormPanelComponent,
  SynFormShellComponent,
  SynInputComponent,
  SynPageShellComponent,
  SynTextLinkComponent,
} from '../../ui';

import { AuthApiService } from '../../auth-api.service';
import { AuthSessionService } from '../../auth-session.service';
import { mapAuthError } from '../../auth-error-mapping';
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '../../auth-validation';
import { AuthenticatedUser } from '../../models/auth.models';

@Component({
  selector: 'app-register-page',
  imports: [
    SynButtonComponent,
    SynFooterComponent,
    SynFormFieldComponent,
    SynFormPanelComponent,
    SynFormShellComponent,
    SynInputComponent,
    SynPageShellComponent,
    SynTextLinkComponent,
  ],
  templateUrl: './register-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  public readonly errorMessage = signal<string | null>(null);
  public readonly submitting = signal(false);

  public constructor(
    private readonly authApi: AuthApiService,
    private readonly authSession: AuthSessionService,
    private readonly destroyRef: DestroyRef,
    private readonly router: Router,
  ) {}

  /**
   * Registers the user and navigates to the signed-in home page.
   *
   * @param event Sign up form submit event.
   */
  public onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget;

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(form);
    const username = String(formData.get('username') ?? '').trim();
    const email = String(formData.get('email') ?? '')
      .trim()
      .toLowerCase();
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    const usernameError = validateUsername(username);

    if (usernameError !== null) {
      this.errorMessage.set(usernameError);
      return;
    }

    const emailError = validateEmail(email);

    if (emailError !== null) {
      this.errorMessage.set(emailError);
      return;
    }

    const passwordError = validatePassword(password);

    if (passwordError !== null) {
      this.errorMessage.set(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage.set('Passwords must match.');
      return;
    }

    this.errorMessage.set(null);
    this.submitting.set(true);
    this.authApi
      .register({
        email,
        password,
        username,
      })
      .pipe(
        switchMap((): Observable<AuthenticatedUser> => this.authApi.me()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (user: AuthenticatedUser): void => {
          this.authSession.signIn(user);
          void this.router.navigate(['/home']);
        },
        error: (err: unknown): void => {
          this.errorMessage.set(mapAuthError(err));
          this.submitting.set(false);
        },
      });
  }
}
