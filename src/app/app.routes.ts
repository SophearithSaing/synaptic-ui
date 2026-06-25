import { Routes } from '@angular/router';

import { authGuard, unauthGuard } from './auth.guard';
import { DesignSystemComponent } from './pages/design-system/design-system.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { SessionPageComponent } from './pages/session-page/session-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'design-system',
    component: DesignSystemComponent,
  },
  {
    path: 'login',
    canActivate: [unauthGuard],
    component: LoginPageComponent,
  },
  {
    path: 'home',
    canActivate: [authGuard],
    component: HomeComponent,
  },
  {
    path: 'session/:topicId',
    canActivate: [authGuard],
    component: SessionPageComponent,
  },
  {
    path: 'session/:topicId/continue/:sessionId',
    canActivate: [authGuard],
    component: SessionPageComponent,
  },
  {
    path: 'session/:topicId/continue',
    canActivate: [authGuard],
    component: SessionPageComponent,
  },
  {
    path: 'register',
    canActivate: [unauthGuard],
    component: RegisterPageComponent,
  },
];
