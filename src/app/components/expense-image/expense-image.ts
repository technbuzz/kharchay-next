import { Component, ElementRef, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { AngularFireStorage } from '@angular/fire/storage'
import { Events, LoadingController, AlertController } from '@ionic/angular'
import { Subscription } from 'rxjs'
import { UtilsService } from 'src/app/services/utils.service'
import { File as IonicFileService, FileReader as IonicFileReader, IFile, FileEntry as IonicFileEntry } from '@ionic-native/file/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'


// import { SwipeBackGesture } from 'ionic-angular/navigation/swipe-back';

@Component({
  selector: 'expense-image',
  templateUrl: 'expense-image.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseImageComponent implements OnInit {
  @ViewChild('fileInput')
  fileInput: ElementRef;
  selectedFiles: FileList
  intentFileAvailable: boolean = false;
  intentBlob: Blob;
  file: File
  imgsrc
  subscriptions: Subscription
  loader: any

  constructor(
    private storage: AngularFireStorage,
    public events: Events,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private utils: UtilsService,
    private fileService: IonicFileService,
    private filePath: FilePath,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit () {
    // FIXME: refactor subscription
    this.events.subscribe('upload:image', () => {
      debugger
      if (!this.intentFileAvailable) {
        this.events.publish('uploaded:image', {
          imageName: null,
          imageUrl: null
        })
        return
      }
      this.presentLoading()
      if (this.selectedFiles.item(0)) {
        this.uploadPic(this.selectedFiles.item(0))
      }
    })

    this.utils.image.subscribe(async (resp:any) => {
      const resolvedPath = await this.filePath.resolveNativePath(resp['android.intent.extra.STREAM'])
      const resolvedFSUrl: IonicFileEntry = await <unknown>this.fileService.resolveLocalFilesystemUrl(resolvedPath) as IonicFileEntry

      const cordovaFile: IFile = await this.utils.convertFileEntryToCordovaFile(resolvedFSUrl)

      this.intentBlob = await this.utils.convertCordovaFileToJavascriptFile(cordovaFile)
      this.imgsrc = await this.renderFile(this.intentBlob)
      this.cdRef.detectChanges()
    })
  }

  async presentLoading () {
    this.loader = await this.loadingCtrl.create({
      message: 'Uploading Image, Please wait...'
    })
    await this.loader.present()
    
  }
  
  async chooseFile(event) {
    this.selectedFiles = event.target.files
    const DataURL = await this.renderFile(this.selectedFiles.item(0))
    this.imgsrc = DataURL
    this.cdRef.detectChanges() //might not needed
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
          // this.imgsrc = reader.result
          // this.intentFileAvailable = true
          // console.log(reader.result)
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
    debugger
    const uniqueKey = `pic${Math.floor(Math.random() * 1000000)}`

    try {
      // const ref = this.storage.ref(`/receipts/${uniqueKey}`)
      const webPref = this.storage.ref(`/receipts/opt${uniqueKey}`)
      await this.storage.upload(`/receipts-next/${uniqueKey}`, file)
      // // this.imgsrc = ;
      // webPref.getDownloadURL().subscribe(resp => {
      //   console.log('getDownloadURL', resp);
        this.events.publish('uploaded:image', {
          imageName: `opt${uniqueKey}`,
          // imageUrl: resp
        })
      // }, error => { 
      //   console.log(error)
      // })
      // FIXME: Fix the loading as the below line is throwing error
      this.loader.dismiss()
      this.loader.onDidDismiss().then(x => this.nullify())
    } catch (error) {

      this.handleUploadError()
      console.log('Upload Task Failed', error)
    }

  }

  async generateUnique(){
    const testSet = new Set(['pic5189','pic5222','pic5429']).values()

    await this.storage.ref('/receipts/pic9999').getMetadata().subscribe(resp => {
      console.log('pix5189 metadata resp: ', resp)
    }, error => {
      console.log(error)
    })
  }

  nullify() {
    debugger
    this.selectedFiles = null
    this.fileInput.nativeElement.value = ''
    this.intentFileAvailable = false
    this.imgsrc = ''
    this.subscriptions && this.subscriptions.unsubscribe()
  }

  async handleUploadError() {
    this.loader && this.loader.dismiss()
    await this.presentErrorAlert()
    this.events.publish('uploading:cancelled')
  }
  
  async presentErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Error!',
      subHeader: 'Something went wrong',
      buttons: ['Ok']
    })

    await alert.present()
  }
}
