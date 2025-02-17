import { Injectable } from '@angular/core';
import { IExpense } from '@models';
import { addDoc, collection, Firestore } from "@angular/fire/firestore";
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  constructor(private firestore: Firestore,

    private storage: Storage,
  ) {
    console.log('Create Service Constructor')
   }

  add(expense: IExpense) {
    return addDoc(collection(this.firestore, 'expense'), expense);
  }

  uploadFile(file: Blob) {
    const uniqueKey = `pic${Math.floor(Math.random() * 1000000)}`;

    const filePath = `/receipts-next/${uniqueKey}`;
    const fileRef = ref(this.storage, filePath);

    const task = uploadBytesResumable(fileRef, file);
    return { task, imageName: `opt${uniqueKey}` }
    task.on('state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // this.loader.style.setProperty('--percent-uploaded', `${progress.toFixed()}%`);
      },
      error => {
        // this.handleUploadError();
        console.log('Upload Task Failed', error);
      },

      () => {
        getDownloadURL(task.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
      // () => {
      //   getDownloadURL(task.snapshot.ref).then((downloadURL) => {
      //     console.log('File available at', downloadURL);
      //   });
      // }
    );

  }
}
