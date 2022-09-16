import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { FirestoreModule, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage, StorageModule } from '@angular/fire/storage';
import { AuthModule, getAuth, provideAuth } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    // AuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    // FirestoreModule,
    // StorageModule,
    // ServiceWorkerModule.register('sw-master.js', { enabled: environment.production })
  ],
  providers: [
    // { provide: FirestoreSettingsToken, useValue: { timestampsInSnapshots: false }},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})



export class AppModule { }
