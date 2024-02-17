import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";

import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideRouter } from "@angular/router";
import { environment } from "@kh/common/environments";
import { appRoutes } from "./app.routes";
import { DatabaseAdapter, FirebaseAdapterService } from "@kh/common/data-adapters";
import { provideHttpClient } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
export const appConfig: ApplicationConfig = {
  providers: [

    provideRouter(appRoutes),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
    ]),

    provideAnimations(),
    provideHttpClient(),

    {
      provide: DatabaseAdapter,
      useClass: FirebaseAdapterService,
      // useClass: SupabaseAdapterService
    }
  ]
}
