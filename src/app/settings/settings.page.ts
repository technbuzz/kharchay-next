import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { Events, AlertController, LoadingController, ToastController } from '@ionic/angular';

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
  loading: any = null;

  constructor(
    private settingsService: SettingsService,
    private events: Events,
    private afAuth: AngularFireAuth,
    public alertController: AlertController,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
    
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

  updateTextMode() {
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
            this.presentLoading();
            this.authService.signInWithEmail(params)
              .then(resp => {
                console.log(resp);
              }).catch(error => {
                console.log(error);
                this.presentToast()
              }).finally(() => {
                this.loading.dismiss();
              })
          }
        }
      ]
    })

    await alert.present()
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true
    });
    return await this.loading.present();
    
  }
  
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Something Not Right 😓 Please try again',
      duration: 3500,
      color: 'warning'
    });
    toast.present();
  }

  
  logout(){
    this.authService.logout()
  }
}
