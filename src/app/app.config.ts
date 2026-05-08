import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { providePrimeNG } from 'primeng/config';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';
import { provideTransloco } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { abankPreset } from './abank-preset';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { TranslocoHttpLoader } from './core/transloco-loader';

const AVAILABLE_LANGS = ['en', 'es'] as const;

function detectLang(): string {
  const stored = localStorage.getItem('lang');
  if (stored && (AVAILABLE_LANGS as readonly string[]).includes(stored)) return stored;
  const browserLang = navigator.language?.split('-')[0];
  if (browserLang && (AVAILABLE_LANGS as readonly string[]).includes(browserLang)) return browserLang;
  return 'en';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: abankPreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    provideTransloco({
      config: {
        availableLangs: [...AVAILABLE_LANGS],
        defaultLang: detectLang(),
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideFormlyCore(withFormlyPrimeNG()),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    MessageService,
  ]
};
