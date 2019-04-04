import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { Events, AlertController } from '@ionic/angular';

import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  dynamicPricing: boolean = false;
  loggedIn: boolean = false;

  constructor(
    private settingsService: SettingsService,
    private events: Events,
    private afAuth: AngularFireAuth,
    public alertController: AlertController,
    private authService: AuthService,
    
  ) {}

  ngOnInit() {
    this.settingsService.getConfig().subscribe(resp => {
      this.dynamicPricing = resp;
    });

    this.afAuth.authState.subscribe(resp => {
      if(resp){
        this.loggedIn = true;
      } else {
        this.loggedIn = false
      }
      console.log('resp: ', resp);
    })
  }

  updateTextMode(event) {
    this.settingsService.inputBS.next(this.dynamicPricing);

    // FIXME: Can't we stop using event here but Subjects only
    this.events.publish('dynamic:Pricing', this.dynamicPricing);
    // update localstorage
    this.settingsService.setConfig({ dynamicPricing: this.dynamicPricing });
  }

  async presentLoginAlert(){
    const alert = await this.alertController.create({
      header: 'Login',
      inputs: [
        {
          name: 'email',
          type: 'text',
          id: 'email',
          placeholder: 'Email Address'
        },
        {
          name: 'password',
          type: 'password',
          id: 'password',
          placeholder: 'Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (params) => {
            console.log('Confirm Ok', params);
            const {email,password} = params;
            if(!email || !password) return
            this.authService.signInWithEmail(params)
              .then(resp => {
                console.log(resp);
              }).catch(error => {
                console.log(error);
                
              })
          }
        }
      ]
    })

    await alert.present()
  }

  // async presentLoadingWithOptions() {
  //   const loading = await this.loadingController.create({
  //     spinner: null,
  //     duration: 5000,
  //     message: 'Please wait...',
  //     translucent: true,
  //     cssClass: 'custom-class custom-loading'
  //   });
  //   return await loading.present();
  // }

  
  logout(){
    this.authService.logout()
  }
}
