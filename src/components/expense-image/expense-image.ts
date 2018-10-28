import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { Events, Loading, AlertController } from 'ionic-angular';

import { LoadingController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'expense-image',
  templateUrl: 'expense-image.html'
})
export class ExpenseImageComponent {
  @ViewChild('fileInput') fileInput: ElementRef;
  selectedFiles: FileList;
  file: File;
  imgsrc;
  subscriptions: Subscription;
  loader: Loading;

  constructor(
    private storage: AngularFireStorage,
    public events: Events,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) {}
    
    ngOnInit() {
      //FIXME: refactor subscription
      this.events.subscribe('upload:image', () => {
        debugger
        if(!this.selectedFiles) {
          this.events.publish('uploaded:image', {imageName: null, imageUrl: null});
          return;
        }
        this.loader = this.loadingCtrl.create({
          content: 'Uploading Image, Please wait...'
        });
        this.loader.present();
        this.uploadPic();
      });
    }


  chooseFile(event) {
    this.selectedFiles = event.target.files;
  }

  uploadPic() {
    if (this.selectedFiles.item(0)) {
      const file = this.selectedFiles.item(0);
      const uniqueKey = `pic${Math.floor(Math.random() * 10000)}`;
      const uploadTask = this.storage.upload(`/receipts/${uniqueKey}`, file)

      this.subscriptions = uploadTask.downloadURL().subscribe(resp => {
        this.imgsrc = resp;
        this.events.publish('uploaded:image', {imageName: uniqueKey, imageUrl: resp});
        this.loader.dismiss().then(x => this.nullify());
      }, error => {
        
        
      });
    }
  }
  
  
  nullify() {
    this.selectedFiles = null;
    this.fileInput.nativeElement.value = '';
    this.imgsrc = '';
    this.subscriptions.unsubscribe();
  }

  handleUploadError(){
    this.loader.dismissAll();

        const alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Something went wrong',
          buttons: ['Ok']
        })

  }
}