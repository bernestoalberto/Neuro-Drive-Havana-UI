// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes), provideAnimationsAsync()]
// };


import { ApplicationConfig, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

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

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimationsAsync(),
    // use `fetch` behind the scenes to support streaming partial responses
    provideHttpClient(withFetch()),
    importProvidersFrom(
      // provideFirebaseApp(() => initializeApp({ "projectId": "appconex-d8cb0", "appId": "1:703344823544:web:1c489178fb9e30a82b3f0d", "databaseURL": "https://appconex-d8cb0-default-rtdb.firebaseio.com", "storageBucket": "appconex-d8cb0.appspot.com", "apiKey": "AIzaSyBCpqgKJALzSlbVmEeTgU3zqWa5UFew6No", "authDomain": "appconex-d8cb0.firebaseapp.com", "messagingSenderId": "703344823544", "measurementId": "G-P3PCR231KM" }))), 
      // importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideAnalytics(() => getAnalytics())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideDatabase(() => getDatabase())), 
      // importProvidersFrom(provideMessaging(() => getMessaging())), 
    //   provideServiceWorker('ngsw-worker.js', {
    //     enabled: !isDevMode(),
    //     registrationStrategy: 'registerWhenStable:30000'
    // }), provideStore(reducers, { metaReducers })
    )
  ]
};
