import { Component, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { AuthApiService } from '../../auth-api.service';
import { AuthSessionService } from '../../auth-session.service';
import { SynButtonComponent } from '../../ui/actions/button/button.component';
import { SynTextLinkComponent } from '../../ui/actions/text-link/text-link.component';
import { SynFormFieldComponent } from '../../ui/forms/form-field/form-field.component';
import { SynFormPanelComponent } from '../../ui/forms/form-panel/form-panel.component';
import { SynInputComponent } from '../../ui/forms/input/input.component';
import { SynBrandComponent } from '../../ui/navigation/brand/brand.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
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
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    this.errorMessage.set(null);
    this.submitting.set(true);
    this.authApi
      .login({ email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: { readonly access_token: string }): void => {
          this.authSession.signIn(response.access_token);
          void this.router.navigate(['/home']);
        },
        error: (): void => {
          this.errorMessage.set('Unable to log in with those credentials.');
          this.submitting.set(false);
        },
      });
  }
}
