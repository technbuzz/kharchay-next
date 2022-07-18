import { Component, Inject, OnInit, Optional, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { SettingsService } from '../services/settings.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { Auth, getAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { authState } from 'rxfire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  dynamicPricing = false;
  loggedIn = false;
  loggedIn$!: Observable<any>;
  loading: any = null;

  constructor(
    private settingsService: SettingsService,
    @Optional() private afAuth: Auth,
    public alertController: AlertController,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.settingsService.getConfig().subscribe(resp => {
      this.dynamicPricing = resp;
    });

    const auth = getAuth();

    // this.loggedIn$ = this.afAuth.authState;
    this.loggedIn$ = authState(this.afAuth).pipe(
      traceUntilFirst('auth'),
      map(u => !!u)
    );
  }

  updateTextMode() {
    this.settingsService.updateConfig(this.dynamicPricing);

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
            if(!email || !password) {return;}
            this.presentLoading();
            this.authService.signInWithEmail(params)
              .then(resp => {
                console.log(resp);
              }).catch(error => {
                console.log(error);
                this.presentToast();
              }).finally(() => {
                this.loading.dismiss();
              });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true
    });
    return await this.loading.present();

  }

  updateTheme(event: any) {
    const checked = event.detail.checked
    if(checked) {
      this.renderer.addClass(this.document.body, 'dark') 
    } else {
      this.renderer.removeClass(this.document.body, 'dark') 
    }
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
    this.authService.logout();
  }
}
