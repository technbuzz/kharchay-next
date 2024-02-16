import { ApplicationConfig } from "@angular/core";
import { RouteReuseStrategy, provideRouter } from "@angular/router";
import { IonicRouteStrategy, provideIonicAngular } from "@ionic/angular/standalone";
import { appRoutes } from "./app.routes";
import { firebaseProviders } from "./firebase.providers";

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(appRoutes),
    firebaseProviders,
    provideIonicAngular(),
  ]
}
