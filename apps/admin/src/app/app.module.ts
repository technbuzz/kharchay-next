import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideStorage } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
// Material section
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DatabaseAdapter, FirebaseAdapterService, SupabaseAdapterService } from '@kh/common/data-adapters';
import { environment } from '@kh/common/environments';
import { getStorage } from 'firebase/storage';
// import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [
    {
      provide: DatabaseAdapter,
      // useClass: FirebaseAdapterService,
      useClass: SupabaseAdapterService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
