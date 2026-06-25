import { Component, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import {
  SynBrandComponent,
  SynButtonComponent,
  SynFooterComponent,
  SynFormFieldComponent,
  SynFormPanelComponent,
  SynFormShellComponent,
  SynInputComponent,
  SynMobileNavComponent,
  SynNavAction,
  SynNavBarComponent,
  SynNavItem,
  SynNavItemsComponent,
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
  standalone: true,
  imports: [
    SynBrandComponent,
    SynButtonComponent,
    SynFooterComponent,
    SynFormFieldComponent,
    SynFormPanelComponent,
    SynFormShellComponent,
    SynInputComponent,
    SynMobileNavComponent,
    SynNavBarComponent,
    SynNavItemsComponent,
    SynPageShellComponent,
    SynTextLinkComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  public readonly errorMessage = signal<string | null>(null);
  public readonly mobileNavOpen = signal(false);
  public readonly submitting = signal(false);

  public readonly navItems: readonly SynNavItem[] = [
    {
      label: 'Documentation',
      routerLink: '/design-system',
    },
    {
      href: 'mailto:support@synaptic.local',
      label: 'Support',
    },
  ];

  public readonly navActions: readonly SynNavAction[] = [
    {
      label: 'Log In',
      routerLink: '/login',
      variant: 'primary',
    },
  ];

  public constructor(
    private readonly authApi: AuthApiService,
    private readonly authSession: AuthSessionService,
    private readonly destroyRef: DestroyRef,
    private readonly router: Router,
  ) {}

  /**
   * Toggles the mobile navigation menu visibility.
   */
  public toggleMobileNav(): void {
    this.mobileNavOpen.update((isOpen: boolean): boolean => !isOpen);
  }

  /**
   * Closes the mobile navigation menu after navigation.
   */
  public closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

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
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
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
