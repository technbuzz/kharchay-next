import { Injectable, inject } from '@angular/core';
import { IExpense } from '@models';
import { addDoc, collection, Firestore } from "@angular/fire/firestore";
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);


  constructor() {
    console.log('Create Service Constructor')
  }

  add(expense: IExpense) {
    return addDoc(collection(this.firestore, 'expense'), expense);
  }

  // uploadFileStream(file: Blob): { task: any, imageName: string }> {
  uploadFileStream(file: Blob, filePath: string) {
    const fileRef = ref(this.storage, filePath);
    const task = uploadBytesResumable(fileRef, file);
    return new Observable<{ progress: number, done: boolean, imageName: string }>((subscriber) => {
      task.on('state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          subscriber.next({ progress, done: false, imageName: ''})
          console.log({progress})
          // this.loader.style.setProperty('--percent-uploaded', `${progress.toFixed()}%`);
        },
        error => {
          // this.handleUploadError();
          console.log('Upload Task Failed', error);
          subscriber.error(error)
        },

        () => {
          subscriber.complete()
        }
      );
    })

  }

  uploadFile(file: Blob): Promise<{ task: any, imageName: string }> {
    const uniqueKey = `pic${Math.floor(Math.random() * 1000000)}`;

    // const filePath = `/receipts-next/${uniqueKey}`;
    const filePath = uniqueKey
    const fileRef = ref(this.storage, filePath);

    const task = uploadBytesResumable(fileRef, file);
    // return { task, imageName: `opt${uniqueKey}` }
    return new Promise((resolve, reject) => {
      task.on('state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log({progress})
          // this.loader.style.setProperty('--percent-uploaded', `${progress.toFixed()}%`);
        },
        error => {
          // this.handleUploadError();
          console.log('Upload Task Failed', error);
        },

        () => {
          console.log('uploaded')
          resolve({ task, imageName: `opt${uniqueKey}` })
        }
      );
    })

  }
}
