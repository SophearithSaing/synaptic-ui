import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Signal,
  computed,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, finalize } from 'rxjs';

import { AuthApiService } from '../auth-api.service';
import { AuthSessionService } from '../auth-session.service';
import {
  SynBrandComponent,
  SynButtonComponent,
  SynMobileNavComponent,
  SynNavAction,
  SynNavBarComponent,
  SynNavItem,
  SynNavItemsComponent,
} from '../ui';

@Component({
  selector: 'app-navbar',
  imports: [
    SynBrandComponent,
    SynButtonComponent,
    SynMobileNavComponent,
    SynNavBarComponent,
    SynNavItemsComponent,
  ],
  templateUrl: './app-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app-navbar.component.scss',
})
export class AppNavbarComponent {
  private readonly currentUrl = signal('');

  public readonly authenticated: Signal<boolean>;

  public readonly brandRouterLink: Signal<string>;

  public readonly mobileActions: Signal<readonly SynNavAction[]>;

  public readonly mobileNavOpen = signal(false);

  public readonly navItems: Signal<readonly SynNavItem[]>;

  public readonly sessionRoute: Signal<boolean>;

  public constructor(
    private readonly authApi: AuthApiService,
    private readonly authSession: AuthSessionService,
    private readonly destroyRef: DestroyRef,
    private readonly router: Router,
  ) {
    this.currentUrl.set(this.router.url);
    this.authenticated = computed((): boolean =>
      this.authSession.isAuthenticated(),
    );
    this.sessionRoute = computed((): boolean =>
      this.currentUrl().startsWith('/session'),
    );
    this.brandRouterLink = computed((): string =>
      this.authenticated() || this.sessionRoute() ? '/home' : '/',
    );
    this.navItems = computed((): readonly SynNavItem[] =>
      this.createNavItems(),
    );
    this.mobileActions = computed((): readonly SynNavAction[] =>
      this.createMobileActions(),
    );

    this.router.events
      .pipe(
        filter(
          (event: unknown): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event: NavigationEnd): void => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.closeMobileNav();
      });
  }

  /**
   * Toggles the mobile navigation menu visibility.
   */
  public toggleMobileNav(): void {
    this.mobileNavOpen.update((isOpen: boolean): boolean => !isOpen);
  }

  /**
   * Closes the mobile navigation menu.
   */
  public closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  /**
   * Handles action-only mobile navigation events.
   *
   * @param actionId Action identifier emitted by mobile navigation.
   */
  public onMobileAction(actionId: string): void {
    if (actionId === 'logout') {
      this.logOut();
    }
  }

  /**
   * Revokes the API session and returns to the landing page.
   */
  public logOut(): void {
    this.authApi
      .logout()
      .pipe(
        finalize((): void => {
          this.authSession.signOut();
          void this.router.navigate(['/']);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  /**
   * Builds the route-aware primary navigation items.
   *
   * @returns Primary navigation items for the current route and auth state.
   */
  private createNavItems(): readonly SynNavItem[] {
    const url = this.currentUrl();

    if (this.sessionRoute()) {
      return [];
    }

    return [
      {
        active: this.isHomeActive(url),
        label: 'Home',
        routerLink: this.authenticated() ? '/home' : '/',
      },
      {
        active: url.startsWith('/design-system'),
        label: 'Design',
        routerLink: '/design-system',
      },
    ];
  }

  /**
   * Builds mobile action items for the current authentication state.
   *
   * @returns Mobile navigation action items.
   */
  private createMobileActions(): readonly SynNavAction[] {
    if (this.sessionRoute()) {
      return [];
    }

    if (this.authenticated()) {
      return [
        {
          actionId: 'logout',
          label: 'Log Out',
          variant: 'secondary',
        },
      ];
    }

    return [
      {
        label: 'Log In',
        routerLink: '/login',
        variant: 'secondary',
      },
      {
        label: 'Sign Up',
        routerLink: '/register',
        variant: 'primary',
      },
    ];
  }

  /**
   * Reports whether the Home navigation item is active.
   *
   * @param url Current router URL.
   * @returns True when the Home item should render as active.
   */
  private isHomeActive(url: string): boolean {
    if (this.authenticated()) {
      return url.startsWith('/home');
    }

    return url === '/' || url.startsWith('/#');
  }
}
