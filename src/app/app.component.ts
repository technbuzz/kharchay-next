import { Component } from '@angular/core'

import { Platform } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { WebIntent } from '@ionic-native/web-intent/ngx'
import { UtilsService } from './services/utils.service'


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private webIntent: WebIntent,
    private utils: UtilsService
  ) {
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#488AFF')
      this.statusBar.styleDefault()
      this.splashScreen.hide()
      this.registerBroadcast()
    })
  }

  private registerBroadcast() {
    if (this.platform.is('cordova')) {
      window['plugins'].intentShim.registerBroadcastReceiver({
        filterActions: [
          'com.darryncampbell.cordova.plugin.broadcastIntent.ACTION'
        ]
      },
        function (intent) {
          //  Broadcast received
          console.log('Received Intent: ' + JSON.stringify(intent.extras))
        }
      )
    }

    this.handleIntent()
  }

  handleIntent () {
    this.webIntent.onIntent().subscribe(intent => {
      this.utils.image.next(intent.extras)
      console.log(intent)
    }, error => {
      console.log(error)
    })
  }
}
