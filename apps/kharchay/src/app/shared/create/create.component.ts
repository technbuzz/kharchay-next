import { Component, DestroyRef, effect, inject, signal, viewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonBackButton, IonLoading, IonProgressBar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, LoadingController, ToastController  } from '@ionic/angular/standalone';
import { formatISO } from 'date-fns/formatISO';
import { CreateService } from '../create.service';
import { NewxComponent } from './newx/newx.component';

import { InvoiceComponent } from '../create/invoice/invoice'
import { concat, finalize, from, tap } from 'rxjs';
import { addIcons } from 'ionicons';
import { cameraOutline, checkmarkCircle } from 'ionicons/icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'kh-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: true,
  imports: [NewxComponent, IonProgressBar, IonLoading , InvoiceComponent, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton],
})
export class CreateComponent {
  private fb = inject(UntypedFormBuilder);
  protected service = inject(CreateService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  #destroyRef = inject(DestroyRef)

  loadingEl = viewChild.required(IonLoading)
  loaderText = signal('dismiss in 3 sec')
  loadingProgress = signal(0)

  form = this.fb.group({
    price: ['', Validators.required],
    date: [formatISO(new Date()), Validators.required],
    category: ['', Validators.required],
    subCategory: null,
    note: ['', Validators.required],
    imageName: '',
    fixed: null
  })

  image: { dataURL: string, blob: Blob } | undefined = undefined

  grabImage(event: { dataURL: string, blob: Blob } | undefined) {
    this.image = event
    console.log({ event })
  }

  constructor() {
    addIcons({checkmarkCircle, cameraOutline})
  }

  readingReceipt = signal(false)
  async readReceipt() {
    this.readingReceipt.set(true)
    const data = await this.service.takePicture()

    if(data) {
      const output = JSON.parse(data.response.text())
      this.form.setValue({
        price: output.price,
        date: formatISO(new Date(output.date)),
        category: output.category,
        subCategory: null,
        note: output.note,
        imageName: '',
        fixed: null
      })
      console.log(this.form.value)
      console.log(output)
    }

    this.readingReceipt.set(false)

  }

  async add() {
    await this.addEntry()
  }


  async addEntry() {
    this.loadingEl().present()
    let stream$ = []
    const uniqueKey = `pic${Math.floor(Math.random() * 1000000)}`;
    if (this.image?.dataURL) {
      this.loaderText.set('Uploading Image, Please wait...')

      const filePath = `/receipts-next/${uniqueKey}`;
      // const filePath = uniqueKey;

      const upload$ = this.service.uploadFileStream(this.image.blob, filePath).pipe(
        tap(resp => {
          console.log(resp)
          this.loadingProgress.set(resp.progress)
        }),
      )

      stream$.push(upload$)
    }

    stream$.push(from(this.addDoc(uniqueKey)).pipe(tap(() => this.loaderText.set('Adding Expense, Please wait...'))))

    concat(...stream$).pipe(
      finalize(() => {
        this.loadingEl().dismiss()
      }),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(resp => {
        console.log(resp)
      }, error => {
        console.log('failed creating ', error)
      }, () => {
        this.presentToast()
        this.tearDown()
        console.log('all done')
      })

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
      imageName: imageName ? `opt${imageName}` : '',
      date: new Date(date)
    }
    return this.service.add(result)
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Added Successfully!',
      duration: 1000,
      icon: 'checkmark-circle',
    });

    await toast.present();
  }


  tearDown() {
    this.form.reset();
    this.router.navigate(['../tabs/home'])
  }
}
