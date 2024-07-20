import { Component, OnDestroy, Optional, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { App } from '@capacitor/app';
// import { WebIntent } from '@ionic-native/web-intent/ngx'

import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { authState } from 'rxfire/auth';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'kh-root',
    imports: [IonApp, IonRouterOutlet],
    standalone: true,
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy {

    private readonly userDesposible!: Subscription;
    @ViewChild(IonRouterOutlet) routerOutlet!: IonRouterOutlet


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
            this.registerHandleBack();
            // this.registerBroadcast()
        });
    }

    ngOnDestroy(): void {
        this.userDesposible.unsubscribe();
    }

    registerHandleBack() {
        this.platform.backButton.subscribeWithPriority(-1, () => {
            if (!this.routerOutlet?.canGoBack()) {
                App.exitApp();
            }
        })

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


