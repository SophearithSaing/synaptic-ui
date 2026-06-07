import { Component, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../auth-api.service';
import { AuthSessionService } from '../../auth-session.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  public readonly errorMessage = signal<string | null>(null);
  public readonly mobileNavOpen = signal(false);
  public readonly submitting = signal(false);

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
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    if (password !== confirmPassword) {
      this.errorMessage.set('Passwords must match.');
      return;
    }

    this.errorMessage.set(null);
    this.submitting.set(true);
    this.authApi
      .register({
        email: String(formData.get('email') ?? ''),
        password,
        username: String(formData.get('username') ?? ''),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: { readonly access_token: string }): void => {
          this.authSession.signIn(response.access_token);
          void this.router.navigate(['/home']);
        },
        error: (): void => {
          this.errorMessage.set(
            'Unable to create an account with those details.',
          );
          this.submitting.set(false);
        },
      });
  }
}
