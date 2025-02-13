import { ApplicationConfig, importProvidersFrom, inject, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpContextToken, HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { environment } from '../environments/environment';
import { MatNativeDateModule } from '@angular/material/core';
import { logginInterceptor, cachingInterceptor, authInterceptor } from './interceptors/interceptors';
export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([
        logginInterceptor,
         cachingInterceptor, authInterceptor]),
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      })
    ),
    provideStore(reducers, { metaReducers }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideMessaging(() => getMessaging()),
    importProvidersFrom(MatNativeDateModule)
  ]
};
