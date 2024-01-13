import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CreateService } from '@kh/mobile/create/data-access';
import {formatISO} from 'date-fns/formatISO';


@Component({
  selector: 'kh-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {

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
  constructor(
    private fb: UntypedFormBuilder,
    private service: CreateService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private toastController: ToastController
  ) {
  }

  grabImage(event: { dataURL:string, blob: Blob }) {
    this.image = event
  }

  async add() {
    await this.addEntry()
    this.form.reset();
    this.router.navigate(['home'])
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
