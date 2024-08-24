import { ApplicationConfig } from "@angular/core";
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from "@angular/router";
import { IonicRouteStrategy, provideIonicAngular } from "@ionic/angular/standalone";
import { appRoutes } from "./app.routes";
import { firebaseProviders } from "./firebase.providers";
import { HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from "@angular/common/http";

function logInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  console.log('[Outgoing Request]')
  let clonned = request.clone(
    {
      headers: request.headers.set('X-Debug', 'Testing')
    }
  )
  return next(clonned)
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(withInterceptors([logInterceptor])),
    provideRouter(appRoutes, withComponentInputBinding() ),
    ...firebaseProviders,
    provideIonicAngular(),
  ]
}
