import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter, withPreloading, PreloadAllModules, RouteReuseStrategy } from "@angular/router";
import { appRoutes } from "./app.routes";
import { firebaseProviders } from "./firebase.providers";
import { IonicRouteStrategy, provideIonicAngular } from "@ionic/angular/standalone";

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(appRoutes),
    firebaseProviders,
    provideIonicAngular(),
  ]
}
