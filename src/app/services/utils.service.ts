import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IFile } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  image = new Subject()

  constructor() { }

  convertFileEntryToCordovaFile(fileEntry: FileEntry): Promise<IFile> {
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

  
}
