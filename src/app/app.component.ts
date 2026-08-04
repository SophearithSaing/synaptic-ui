import {
  Component,
  DestroyRef,
  OnInit,
  ChangeDetectionStrategy,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { AuthInitializationService } from './auth-initialization.service';
import { AuthSessionService } from './auth-session.service';
import { SynFooterComponent } from './ui';

@Component({
  selector: 'app-root',
  imports: [AppNavbarComponent, RouterOutlet, SynFooterComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public readonly authInitialized: Signal<boolean>;

  public constructor(
    private readonly authInitialization: AuthInitializationService,
    private readonly authSession: AuthSessionService,
    private readonly destroyRef: DestroyRef,
  ) {
    this.authInitialized = this.authSession.initialized;
  }

  /**
   * Starts first-load authentication before rendering application routes.
   */
  public ngOnInit(): void {
    this.authInitialization
      .initialize()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
