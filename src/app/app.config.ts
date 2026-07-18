import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideHttpClient,
  withInterceptors,
  withXhr,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { authHttpInterceptor } from './auth-http.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(withXhr(), withInterceptors([authHttpInterceptor])),
    provideRouter(routes),
  ],
};
