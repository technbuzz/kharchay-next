import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CreateService } from '@kh/mobile/create/data-access';
import formatISO from 'date-fns/formatISO';


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
    private fb: FormBuilder, 
    private service: CreateService, 
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
  }

  grabImage(event: { dataURL:string, blob: Blob }) {
    this.image = event
  }

  async addEntry() {
    if (this.image.dataURL) { 
      const loader = await this.presentLoading() 
      const { task, imageName } = this.service.uploadFile(this.image.blob); 
      await task;
      loader.dismiss();
      this.addDoc(imageName)
    }
    
    this.addDoc()
    this.form.reset();
    this.router.navigate(['home'])
    
  }
  
  private async addDoc(imageName = '') {
    const { date } = this.form.value
    const response = await this.service.add({
      ...this.form.value,
      imageName: imageName,
      date: new Date(date)
    })
  }
  
  async presentLoading() {
    const loader = await this.loadingCtrl.create({
      message: 'Uploading Image, Please wait...',
      spinner: 'bubbles',
      cssClass: 'loading-upload-image'
    });
    await loader.present();
    return loader
  }

}
