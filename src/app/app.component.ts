import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { AuthInitializationService } from './auth-initialization.service';
import { AuthSessionService } from './auth-session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public readonly authInitialized = this.authSession.initialized;

  public constructor(
    private readonly authInitialization: AuthInitializationService,
    private readonly authSession: AuthSessionService,
    private readonly destroyRef: DestroyRef,
  ) {}

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
