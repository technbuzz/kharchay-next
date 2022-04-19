import { Component, OnDestroy, Optional } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
// import { WebIntent } from '@ionic-native/web-intent/ngx'

import { Platform } from '@ionic/angular';
import { authState } from 'rxfire/auth';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'kh-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy {

  private readonly userDesposible!: Subscription;


  constructor(
    private platform: Platform,
    @Optional() private afAuth: Auth,
    // private webIntent: WebIntent,
  ) {

    this.userDesposible = authState(this.afAuth).pipe(
      traceUntilFirst('auth'),
      map(u => !!u)
    ).subscribe(isLoggedIn => {
      console.log('isLoggedIn: ', isLoggedIn);
    });
    // this.afAuth.authState.subscribe(c => {
    //   console.log(c);
    // });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.registerBroadcast()
      // this.handleBackButton();
    });
  }

  ngOnDestroy(): void {
    this.userDesposible.unsubscribe();
  }

  // private registerBroadcast() {
  //   if (this.platform.is('cordova')) {
  //     window['plugins'].intentShim.registerBroadcastReceiver({
  //       filterActions: [
  //         'com.darryncampbell.cordova.plugin.broadcastIntent.ACTION'
  //       ]
  //     },
  //       function (intent) {
  //         //  Broadcast received
  //         console.log('Received Intent: ' + JSON.stringify(intent.extras))
  //       }
  //     )
  //   }

  //   this.handleIntent()
  // }

  // private handleBackButton() {
  //   if (this.platform.is('android')) {
  //     this.platform.backButton.subscribe(() => {
  //       if (window.location.pathname.includes('home')) {
  //         navigator.app.exitApp();
  //       }
  //     });
  //   }
  // }

  // handleIntent () {
  //   this.webIntent.onIntent().subscribe(intent => {
  //     this.utils.image.next(intent.extras)
  //     console.log(intent)
  //   }, error => {
  //     console.log(error)
  //   })
  // }

  // registerShortcuts() {
  //   if (this.platform.is('cordova')) {
  //     // @ts-ignore
  //     window.plugins.Shortcuts.supportsDynamic(supported => {
  //       console.log('supported: Dynamic ', supported);
  //     }, error => {
  //       console.log('error: ', error);
  //     })
  //   }
  // }
}


