import { Component, ElementRef, ViewChild, OnInit } from '@angular/core'
import { AngularFireStorage } from '@angular/fire/storage'
import { Events, LoadingController, AlertController } from '@ionic/angular'
import { Subscription } from 'rxjs'
import { retryWhen } from 'rxjs/operators'
import { UtilsService } from 'src/app/services/utils.service'
import { File } from '@ionic-native/file/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'


// import { SwipeBackGesture } from 'ionic-angular/navigation/swipe-back';

@Component({
  selector: 'expense-image',
  templateUrl: 'expense-image.html'
})
export class ExpenseImageComponent implements OnInit {
  @ViewChild('fileInput')
  fileInput: ElementRef
  selectedFiles: FileList
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
    private fileService: FilePath
  ) {}

  ngOnInit () {
    // FIXME: refactor subscription
    this.events.subscribe('upload:image', () => {
      if (!this.selectedFiles) {
        this.events.publish('uploaded:image', {
          imageName: null,
          imageUrl: null
        })
        return
      }
      this.presentLoading()
      this.uploadPic()
    })

    this.utils.image.subscribe((resp:any) => {
      debugger
      this.fileService.resolveNativePath(resp['android.intent.extra.STREAM']).then(resp => {
        console.log(resp)
        
      }).catch(error => {
        console.log(error)
        
      })


      
      // this.fileService.readAsDataURL(resp['android.intent.extra.STREAM'],'myFile').then(dataURL => 
      //   console.log(dataURL)
      // ).catch(error => {
      //   console.log(error)
      // })
      console.log(resp)
    })
  }

  async presentLoading () {
    this.loader = await this.loadingCtrl.create({
      message: 'Uploading Image, Please wait...'
    })
    await this.loader.present()

  }

  chooseFile(event) {
    this.selectedFiles = event.target.files
    this.renderFile(this.selectedFiles.item(0))
  }

  renderFile(file){
    const reader = new FileReader()
    reader.addEventListener('load', x => {
      this.imgsrc = reader.result
      console.log(x)

    })

    if(file){
      reader.readAsDataURL(file)
    }

  }

  // FIXME: clearSelection(event:SwipeBackGesture){
  clearSelection(event) {
    this.nullify()
  }

  async uploadPic() {
    if (this.selectedFiles.item(0)) {
      const file = this.selectedFiles.item(0)
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
        this.loader.onDidDismiss().then(x=>this.nullify())
      } catch (error) {

        this.handleUploadError()
        console.log('Upload Task Failed', error)
      }

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
    this.selectedFiles = null
    this.fileInput.nativeElement.value = ''
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
