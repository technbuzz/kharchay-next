import { Component, OnInit } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, Firestore, firestoreInstance$, getFirestore } from '@angular/fire/firestore';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { concatMap, first, take } from 'rxjs/operators';
import { SettingsService } from '../services/settings.service';
import { UtilsService } from '../services/utils.service';
import { Expense } from '../shared/expense.class';
import { IExpense } from '../shared/expense.interface';

@Component({
  selector: 'kh-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  app = getFirestore().app;
  recurringLoading = false;
  dynamicPricing = true;

  expCollRef = firestoreInstance$.pipe(
    first(),
    concatMap(firestore => collectionData(collection(firestore, 'expense')))
  );
  expenses!: Observable<Expense[]>;
  recurringExpenses = [];
  reccuringExpenseId: string|undefined = undefined;


  constructor(
    private alertCtrl: AlertController,
    private firestore: Firestore,
    private settingService: SettingsService,
    private loadingCtrl: LoadingController,
    private utilService: UtilsService,
  ) {
  }

  ngOnInit() {

    this.settingService.getConfig().subscribe(initialSettings => {
      this.dynamicPricing = initialSettings;
    });

    // dynamicPricing event management
    this.settingService.inputBS$.subscribe(config => {
      this.dynamicPricing = config;
    });

    this.checkRecurring();

  }


  public dynamicHandler(price: any): void {
    // this.expense.price = price;
  }

  async presentLoading() {
    const loader = await this.loadingCtrl.create({
      message: 'Uploading Image, Please wait...',
      cssClass: 'custom-loading'
    });
    await loader.present();
  }

  public async delete(item: Expense) {
    // this.expCollRef.doc('yourid').delete();
    const confirm = await this.alertCtrl.create({
      subHeader: 'Do you really want to delete',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          handler: () => this.deleteResource(item)
        }
      ]
    });
    confirm.present();
  }



  checkRecurring() {
    collectionData(collection(this.firestore, 'tasks'))
      // this.afs.collection('tasks').valueChanges()
      .subscribe(resp => {
        // FIXME:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.recurringExpenses = resp.map((item: IExpense) => ({
          ...item,
          date: item.date.toDate()
        }));
      });
  }

  async deleteResource(item: any) {
    // FIXME: below is broken code kindly fix it
    // await deleteDoc(doc(item.id));
    // this.expCollRef.doc(item.id).delete();
    // FIXME: Refactor this subscription
    // if(!item.imageName) {return;}
    // const imagesRef = ref(this.storage, `receipts/${item.imageName}`);
    // deleteObject(imagesRef).then()
    // this.storage
    // .ref(`receipts/${item.imageName}`)
    // .delete()
    // .subscribe(
    //   resp => {
    //     console.log('resource deleted', resp);
    //   },
    //   error => console.log(error)
    // );
  }

  addRecurring(item: IExpense) {
    this.recurringLoading = true;

    if (item.fixed) {
      // FIXME:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      this.addItem(undefined, item).then(resp => {
        this.recurringLoading = false;
        // FIXME:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.deleteRecurring(item.id);
      });
    } else {

      // this.expense = { ...item };
      // this.select.open();
      this.reccuringExpenseId = item.id;

      this.utilService.recurringTask$
        .pipe(take(1))
        .subscribe(resp => {
          // FIXME:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
          this.deleteRecurring(item.id).finally(() => {
            this.recurringLoading = false;
            // FIXME:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
            this.reccuringExpenseId = null;
          });
        });
    }
  }

  deleteRecurring(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `tasks${id}`));
    // return this.afs.collection('tasks').doc(id).delete();
  }

  async addTasks() {
    // FIXME:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
    // const expenseInstance = new Expense(100, 'Shared Wifi Monthly Fee with neighbor', null, { title: 'bills' }, new Date(null),
      // this.showSubCategory ? this.selectedSubCategory : null, true
    // );

    // try {
      // const response = await addDoc(collection(this.firestore, 'recurring'), { ...expenseInstance });
      // console.log('response: ', response);
    // } catch (error) {
      // console.log('error: ', error);
    // }
  }


  trackByFn(index:any, item: IExpense) {
    return item.id;
  }
}
// 304 lines