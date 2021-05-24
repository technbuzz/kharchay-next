import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IFile, FileEntry as IonicFileEntry } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private recurringTask = new Subject()
  recurringTask$ = this.recurringTask.asObservable()
  image = new Subject()

  constructor() { }

  convertFileEntryToCordovaFile(fileEntry: IonicFileEntry): Promise<IFile> {
    return new Promise<IFile>((resolve, reject) => {
      fileEntry.file(resolve, reject)
    })
  }

  convertCordovaFileToJavascriptFile(cordovaFile: IFile): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.error) {
          reject(reader.error)
        } else {
          const blob: any = new Blob([reader.result], {type: cordovaFile.type })
          blob.lastModifiedDate = new Date()
          blob.name = cordovaFile.name
          resolve(blob as File)
        }
      }

      reader.readAsArrayBuffer(cordovaFile);
    })
  }

  setRecurring(value) {
    this.recurringTask.next(value)
  }

  
}
