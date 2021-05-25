import { Component, ElementRef, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core'
import { AngularFireStorage } from '@angular/fire/storage'
import { LoadingController, AlertController } from '@ionic/angular'
import { ReplaySubject, Observable } from 'rxjs'
import { UtilsService } from 'src/app/services/utils.service'
import { File as IonicFileService, FileReader as IonicFileReader, IFile, FileEntry as IonicFileEntry } from '@ionic-native/file/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
import { finalize } from 'rxjs/operators'
import { ImageService } from 'src/app/services/image.service'

// import { SwipeBackGesture } from 'ionic-angular/navigation/swipe-back';

@Component({
  selector: 'expense-image',
  templateUrl: 'expense-image.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseImageComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput', { static: true })
  fileInput: ElementRef;
  selectedFiles: FileList
  intentFileAvailable: boolean = false;
  private intentBlob: Blob;
  file: File
  imgsrc
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1)
  loader: HTMLIonLoadingElement

  downloadURL: Observable<string>;


  constructor(
    private storage: AngularFireStorage,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private utils: UtilsService,
    private fileService: IonicFileService,
    private filePath: FilePath,
    private cdRef: ChangeDetectorRef,
    private imageService: ImageService
  ) {}

  ngOnInit () {
    // FIXME: refactor subscription
    this.imageService.upload$.subscribe(async x => {
      if (this.selectedFiles) {
        await this.presentLoading()
        this.uploadPic(this.selectedFiles.item(0))
      } else if (this.intentFileAvailable) {
        this.uploadPic(this.intentBlob)
      } else {

        this.imageService.setUploaded({
          imageName: null,
          imageUrl: null
        })
        return
      }
    })

    this.utils.image.subscribe(async (resp:any) => {
      try {
        const resolvedPath = await this.filePath.resolveNativePath(resp['android.intent.extra.STREAM'])
        const resolvedFSUrl: IonicFileEntry = await <unknown>this.fileService.resolveLocalFilesystemUrl(resolvedPath) as IonicFileEntry

        const cordovaFile: IFile = await this.utils.convertFileEntryToCordovaFile(resolvedFSUrl)

        this.intentBlob = await this.utils.convertCordovaFileToJavascriptFile(cordovaFile)
        this.imgsrc = await this.renderFile(this.intentBlob)
        this.intentFileAvailable = true
        this.cdRef.detectChanges()
      } catch (error) {
        console.log(error)
        
      }
    })
  }

  async presentLoading () {
    this.loader = await this.loadingCtrl.create({
      message: 'Uploading Image, Please wait...',
      spinner: 'bubbles',
      cssClass: 'loading-upload-image'
    })
    await this.loader.present()
  }
  
  async chooseFile(event) {
    this.selectedFiles = event.target.files
    const DataURL = await this.renderFile(this.selectedFiles.item(0))
    this.imgsrc = DataURL
    this.cdRef.detectChanges()
  }

  renderFile(file): Promise<any> {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
      reader.onloadend = (event) => {
        if (reader.error) {
          reject(reader.error)
          console.log(reader.error)
        } else {
          resolve(reader.result)
        }
      }

      reader.readAsDataURL(file)
    })
  }

  // FIXME: clearSelection(event:SwipeBackGesture){
  clearSelection(event) {
    this.nullify()
  }

  async uploadPic(file) {
    const uniqueKey = `pic${Math.floor(Math.random() * 1000000)}`

    try {
      // const ref = this.storage.ref(`/receipts/${uniqueKey}`)
      const webPref = this.storage.ref(`/receipts/opt${uniqueKey}`)
      const filePath = `/receipts-next/${uniqueKey}`
      const fileRef = this.storage.ref(filePath)
      // const task = this.storage.upload(`/receipts-next/${uniqueKey}`, file);
      // await this.storage.upload(`/receipts-next/${uniqueKey}`, file)
      const task = this.storage.upload(filePath, file);

      task.percentageChanges().subscribe(resp => {
        this.loader.style.setProperty("--percent-uploaded", `${resp.toFixed()}%`)
      })

      this.imageService.setUploaded({
        imageName: `opt${uniqueKey}`,
      })


      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => { 
          this.loader && this.loader.dismiss()
        })
      ).subscribe();
      
      this.loader && this.loader.onDidDismiss().then(x => this.nullify())  

    } catch (error) {

      this.handleUploadError()
      console.log('Upload Task Failed', error)
    }

  }

  nullify() {
    this.selectedFiles = null
    this.fileInput.nativeElement.value = ''
    this.intentFileAvailable = false
    this.imgsrc = null
    this.cdRef.detectChanges()
  }

  async handleUploadError() {
    this.loader && this.loader.dismiss()
    await this.presentErrorAlert()
    this.imageService.setCancelled(true)
  }
  
  async presentErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Error!',
      subHeader: 'Something went wrong',
      buttons: ['Ok']
    })

    await alert.present()
  }

  ngOnDestroy() {
    this.destroyed$.next(true)
    this.destroyed$.complete()
  }
}