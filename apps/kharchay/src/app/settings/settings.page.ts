import { Component, VERSION, Inject, OnInit, Optional, Renderer2 } from '@angular/core';
import { DOCUMENT, NgIf, AsyncPipe } from '@angular/common'
import { } from "@ionic/core";
import { SettingsService } from '../services/settings.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular/standalone';

import { Auth, getAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { authState } from 'rxfire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { map } from 'rxjs/operators';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonToggle, IonLabel, IonButton } from "@ionic/angular/standalone";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, NgIf, AsyncPipe, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonToggle, IonLabel, IonButton]
})
export class SettingsPage implements OnInit {
    version = VERSION.full;
    dynamicPricing = false;
    deleteRights = false;
    loggedIn = false;
    loggedIn$!: Observable<any>;
    loading: any = null;
    themeToggle = false;

    constructor(
        private settingsService: SettingsService,
        @Optional() private afAuth: Auth,
        public alertController: AlertController,
        private authService: AuthService,
        private loadingController: LoadingController,
        private toastController: ToastController,
    ) { }

    ngOnInit() {
        this.settingsService.getConfig().subscribe(resp => {
            this.dynamicPricing = resp.dynamicPricing;
            this.deleteRights = resp.deleteRights;
        });

        const auth = getAuth();

        // this.loggedIn$ = this.afAuth.authState;
        this.loggedIn$ = authState(this.afAuth).pipe(
            traceUntilFirst('auth'),
            map(u => !!u)
        );
    }

    updateTextMode() {
        // this.settingsService.updateConfig(this.dynamicPricing);
        this.settingsService.updateConfig({ dynamicPricing: this.dynamicPricing });

        // update localstorage
        this.settingsService.setConfig({ dynamicPricing: this.dynamicPricing });
    }

    updateDeleteRights() {
        this.settingsService.updateConfig({ deleteRights: this.deleteRights });
        this.settingsService.setConfig({ deleteRights: this.deleteRights });

    }

    async presentLoginAlert() {
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
                        const { email, password } = params;
                        if (!email || !password) { return; }
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

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Something Not Right 😓 Please try again',
            duration: 3500,
            color: 'warning'
        });
        toast.present();
    }

    // Listen for the toggle check/uncheck to toggle the dark theme
    toggleChange(ev: any) {
        this.toggleDarkTheme(ev.detail.checked);
    }

    // Add or remove the "dark" class on the document body
    toggleDarkTheme(shouldAdd: boolean) {
        document.body.classList.toggle('dark', shouldAdd);
    }


    logout() {
        this.authService.logout();
    }
}
