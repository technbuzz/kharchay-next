import { Component, inject} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, LoadingController, ToastController } from '@ionic/angular/standalone';
import {formatISO} from 'date-fns/formatISO';
import { CreateService } from '../create.service';
import { NewxComponent } from './newx/newx.component';


@Component({
    selector: 'kh-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    standalone: true,
    imports: [NewxComponent, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton ],
})
export class CreateComponent {
  private fb = inject(UntypedFormBuilder);
  private service = inject(CreateService);
  private loadingCtrl = inject(LoadingController);
  private router = inject(Router);
  private toastController = inject(ToastController);

  form = this.fb.group({
    price: ['', Validators.required],
    date: [formatISO(new Date()), Validators.required],
    category: ['', Validators.required],
    subCategory: null,
    note: ['', Validators.required],
    imageName: '',
    fixed: null
  })

  image!: { dataURL: string, blob: Blob }

  grabImage(event: { dataURL:string, blob: Blob }) {
    this.image = event
  }

  async add() {
    await this.addEntry()
    this.form.reset();
    this.router.navigate(['../tabs/home'])
  }

  async addEntry() {
    const loader = await this.presentLoading()
    if (this.image?.dataURL) {
      loader.message = 'Uploading Image, Please wait...';
      const { task, imageName } = this.service.uploadFile(this.image.blob);
      await task;
      loader.message = 'Adding Expense, Please wait...';
      await this.addDoc(imageName)
    } else {
      loader.message = 'Adding Expense, Please wait...';
      await this.addDoc()
    }

    return loader.dismiss();
  }

  async saveAndAddMore() {
    await this.addEntry()
    this.presentToast()
  }

  private addDoc(imageName = '') {
    const { date, price } = this.form.value
    const result = {
      ...this.form.value,
      price: Number(price),
      imageName: imageName,
      date: new Date(date)
    }
    return this.service.add(result)
  }

  async presentLoading() {
    const loader = await this.loadingCtrl.create({
      message: 'Loading, Please wait...',
      spinner: 'bubbles',
      cssClass: 'loading-upload-image'
    });
    await loader.present();
    return loader
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Added Successfully!',
      duration: 1000,
      icon: 'checkmark-circle',
    });

    await toast.present();
  }
}
