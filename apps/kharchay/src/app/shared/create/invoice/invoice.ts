import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, input, model, Output, ViewChild } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'kh-invoice',
  imports: [IonList, IonItem, IonLabel, IonButton, IonIcon],
  templateUrl: 'invoice.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceComponent {
  imgSrc = model<string>()

  @ViewChild('fileInput', { static: true })
  fileInput!: ElementRef;

  @ViewChild('img') img: any;
  @Output() imageRendered = new EventEmitter<{ dataURL: string, blob: Blob } | undefined>();

  loader!: HTMLIonLoadingElement;
  downloadURL!: Observable<string>;

  constructor(
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private cdRef: ChangeDetectorRef,
  ) {
    addIcons({ closeOutline })
  }

  async chooseFile(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length) {
      const blob = files[0]
      const dataURL = await this.renderFile(blob) as string;
      this.imgSrc.set(dataURL)
      this.imageRendered.emit({ dataURL, blob })
      this.cdRef.detectChanges();
    }
  }

  removeImage() {
    this.imgSrc.set(undefined)
    this.imageRendered.emit(undefined)
  }

  renderFile(file:any): Promise<string | ArrayBuffer | null> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = (event) => {
        if (reader.error) {
          reject(reader.error);
          console.log(reader.error);
        } else {
          resolve(reader.result);
        }
      };

      reader.readAsDataURL(file);
    });
  }

  async handleUploadError() {
    if(this.loader) {
      this.loader.dismiss();
    }
    await this.presentErrorAlert();
    // bring me back
  }

  async presentErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Error!',
      subHeader: 'Something went wrong',
      buttons: ['Ok']
    });

    await alert.present();
  }

}
