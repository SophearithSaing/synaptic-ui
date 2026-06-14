import { Component, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { AuthApiService } from '../../auth-api.service';
import { AuthSessionService } from '../../auth-session.service';
import { SynButtonComponent } from '../../ui/actions/button/button.component';
import { SynTextLinkComponent } from '../../ui/actions/text-link/text-link.component';
import { SynFormFieldComponent } from '../../ui/forms/form-field/form-field.component';
import { SynFormPanelComponent } from '../../ui/forms/form-panel/form-panel.component';
import { SynFormShellComponent } from '../../ui/forms/form-shell/form-shell.component';
import { SynInputComponent } from '../../ui/forms/input/input.component';
import { SynPageShellComponent } from '../../ui/layout/page-shell/page-shell.component';
import { SynBrandComponent } from '../../ui/navigation/brand/brand.component';
import { SynFooterComponent } from '../../ui/navigation/footer/footer.component';
import { SynMobileNavComponent } from '../../ui/navigation/mobile-nav/mobile-nav.component';
import {
  SynNavAction,
  SynNavItem,
} from '../../ui/navigation/models/nav-item.model';
import { SynNavBarComponent } from '../../ui/navigation/nav-bar/nav-bar.component';
import { SynNavItemsComponent } from '../../ui/navigation/nav-items/nav-items.component';

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
