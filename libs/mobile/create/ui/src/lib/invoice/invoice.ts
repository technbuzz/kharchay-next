import { Component, ElementRef, ViewChild, OnInit, ChangeDetectionStrategy, NgModule, Output, EventEmitter } from '@angular/core';
import { ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { LoadingController, AlertController, GestureController, IonicModule } from '@ionic/angular';
import { ReplaySubject, Observable } from 'rxjs';
// import { UtilsService } from "../../services/utils.service";
import { File as IonicFileService, FileReader as IonicFileReader, IFile, FileEntry as IonicFileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { CommonModule } from '@angular/common';
// import { ImageService  } from "../../services/image.service";

@Component({
  selector: 'kh-invoice',
  templateUrl: 'invoice.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceComponent implements
  OnInit,
  AfterViewInit,
  OnDestroy
{
  @ViewChild('fileInput', { static: true })
  fileInput!: ElementRef;

  @ViewChild('img') img: any;

  @Output() imageRendered = new EventEmitter<{
    dataURL: string,
    blob: Blob
  }>();

  selectedFiles!: FileList|undefined;
  imgsrc!: any;
  loader!: HTMLIonLoadingElement;
  downloadURL!: Observable<string>;

  private intentBlob!: Blob;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);



  constructor(
    // private storage: Storage,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    //// private utils: UtilsService,
    private cdRef: ChangeDetectorRef,
    //// private imageService: ImageService,
    private gestureCtrl: GestureController
  ) {}

  ngOnInit() {
    // FIXME: refactor subscription
    // this.imageService.upload$.subscribe(async x => {
    //   if (this.selectedFiles) {
    //     await this.presentLoading();
    //     this.uploadPic(this.selectedFiles.item(0));
    //   } else if (this.intentFileAvailable) {
    //     this.uploadPic(this.intentBlob);
    //   } else {

    //     this.imageService.setUploaded({
    //       imageName: null,
    //       imageUrl: null
    //     });
    //     return;
    //   }
    // });

    // this.utils.image.subscribe(async (resp: any) => {
    //   try {
    //     const resolvedPath = await this.filePath.resolveNativePath(resp['android.intent.extra.STREAM']);
    //     const resolvedFSUrl: IonicFileEntry = await this.fileService.resolveLocalFilesystemUrl(resolvedPath) as IonicFileEntry;

    //     const cordovaFile: IFile = await this.utils.convertFileEntryToCordovaFile(resolvedFSUrl);

    //     this.intentBlob = await this.utils.convertCordovaFileToJavascriptFile(cordovaFile);
    //     this.imgsrc = await this.renderFile(this.intentBlob);
    //     this.intentFileAvailable = true;
    //     this.cdRef.detectChanges();
    //   } catch (error) {
    //     console.log(error);

    //   }
    // });
    console.log('data')
  }

  ngAfterViewInit() {
    console.log('data')

    // FIXME: Doesn't work with ngIf
    // const gesture = this.gestureCtrl.create({
    //   el: this.img.el,
    //   gestureName: 'move',
    //   onEnd: detail => {
    //     const type = detail.type;
    //     const currentX = detail.currentX;
    //     const deltaX = detail.deltaX;
    //     const velocityX = detail.velocityX;
    //     if (deltaX < 0) {
    //       this.nullify()
    //     }
    //   }
    // })

    // gesture.enable()
  }

  async chooseFile(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles?.item(0)) {
      const blob = this.selectedFiles?.item(0) as File
      const dataURL = await this.renderFile(blob) as string;
      this.imgsrc = dataURL;
      this.imageRendered.emit({ dataURL, blob })
      this.cdRef.detectChanges();
    }
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

  // FIXME: clearSelection(event:SwipeBackGesture){
  clearSelection() {
    this.nullify();
  }

  async uploadPic(file:any) {
    const uniqueKey = `pic${Math.floor(Math.random() * 1000000)}`;

  }

  nullify() {
    this.selectedFiles = undefined;
    this.fileInput.nativeElement.value = '';
    // this.intentFileAvailable = false;
    this.imgsrc = null;
    this.cdRef.detectChanges();
  }

  async handleUploadError() {
    if(this.loader) {
      this.loader.dismiss();
    }
    await this.presentErrorAlert();
    // bring me back
    // this.imageService.setCancelled(true);
  }

  async presentErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Error!',
      subHeader: 'Something went wrong',
      buttons: ['Ok']
    });

    await alert.present();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

@NgModule({
  declarations: [InvoiceComponent],
  imports: [IonicModule.forRoot(), CommonModule],
  exports: [InvoiceComponent]
})
export class InvoiceModule {

}

// 193lines
