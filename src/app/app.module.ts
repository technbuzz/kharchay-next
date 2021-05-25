import { NgModule } from '@angular/core'
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { AngularFireModule, FirebaseAppConfig } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFireAuthModule } from '@angular/fire/auth'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { ComponentsModule } from './components/components.module'
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment'
import { MyHammerConfig } from './shared/hammerConfig'
// import { WebIntent } from '@ionic-native/web-intent/ngx'
import { File } from '@ionic-native/file/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'


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
    AngularFireStorageModule, ServiceWorkerModule.register('sw-master.js', { enabled: environment.production })
  ],
  providers: [
    // WebIntent,
    File,
    FilePath,
    // { provide: FirestoreSettingsToken, useValue: { timestampsInSnapshots: false }},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}
  ],
  bootstrap: [AppComponent]
})



export class AppModule { }
