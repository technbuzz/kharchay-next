import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireModule, FirebaseAppConfig } from "@angular/fire";
import { AngularFirestoreModule, FirestoreSettingsToken } from "@angular/fire/firestore";
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from "@angular/fire/auth";


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { ComponentsModule } from './components/components.module';

const config:FirebaseAppConfig = {
  
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    ComponentsModule,
    IonicModule.forRoot(), 
    AppRoutingModule, 
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase), 
    AngularFirestoreModule, 
    AngularFireStorageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: FirestoreSettingsToken, useValue: { timestampsInSnapshots: false }},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})



export class AppModule { }
