import { inject, Injectable } from '@angular/core';
import { deleteObject, ref, Storage } from '@angular/fire/storage';
import { deleteDoc, collection, Firestore, doc } from "@angular/fire/firestore";
import { AlertController } from '@ionic/angular/standalone';
import { IExpense } from '@models';

@Injectable({providedIn: 'root'})
export class TearDownService {
  private firestore = inject(Firestore);

  private storage = inject(Storage);
  private alertCtrl = inject(AlertController);

  public async delete(item: IExpense) {
    // this.expCollRef.doc('yourid').delete();
    const confirm = await this.alertCtrl.create({
      subHeader: 'Do you really want to delete',
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler: () => this.deleteResource(item),
        },
      ],
    });
    confirm.present();
  }


  async deleteResource(item: any) {
    const r = doc(this.firestore, `expense/${item.id}`)
    const deleteResp = await deleteDoc(r)
    console.log('doc deleted', deleteResp)

    if(item.imageName) {
      const imagesRef = ref(this.storage, `receipts/${item.imageName}`);
      const resp = await deleteObject(imagesRef)
      console.log('image deleted', resp)
    }

    // .then()
    // this.storage.ref(`receipts/${item.imageName}`)
    // .delete()
    // .subscribe(
    //   resp => {
    //     console.log('resource deleted', resp);
    //   },
    //   error => console.log(error)
    // );

  }
}
