import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AppComponent } from './app.component';
import { AuthInitializationService } from './auth-initialization.service';
import { AuthSessionService } from './auth-session.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    const authInitialization = {
      initialize: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthInitializationService,
          useValue: authInitialization,
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should render the routed shell', () => {
    TestBed.inject(AuthSessionService).completeInitialization();

    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelectorAll('syn-footer').length).toBe(1);
  });
});
