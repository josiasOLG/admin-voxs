import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { CookieService } from 'ngx-cookie-service';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { coreProviders } from './core/core.providers';
import { VoxsPrimeNGPreset } from './core/primeng.preset';
import { sharedProviders } from './shared/shared.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: definePreset(Aura, VoxsPrimeNGPreset),
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false,
        },
      },
      ripple: true,
    }),
    CookieService,
    ...coreProviders,
    ...sharedProviders,
  ],
};
