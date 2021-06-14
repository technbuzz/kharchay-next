import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { IonDatetime, AlertController, LoadingController, IonSelect } from '@ionic/angular';

import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import addDays from 'date-fns/esm/addDays';
import isAfter from 'date-fns/esm/isAfter';
import subDays from 'date-fns/esm/subDays';
import format from 'date-fns/esm/format';
import startOfMonth from 'date-fns/esm/startOfMonth';



import { ICategory } from '../shared/category.interface';
import { categories } from '../shared/categories';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IExpense } from '../shared/expense.interface';
import { SettingsService } from '../services/settings.service';
import { Expense } from '../shared/expense.class';
import { ImageService } from '../services/image.service';
import { take, takeUntil, tap } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('expenseDate', { static: true })
  expenseDate: IonDatetime;

  @ViewChild(IonSelect, {static: true}) select: IonSelect;

  cdo = new Date();
  currentMonth = format(new Date(), 'MMMM');
  startOfMonth = startOfMonth(this.cdo);
  maxDate: string;

  expense: IExpense = {
    price: null,
    note: '',
    category: null,
    date: new Date().toISOString(),
    imageName: '',
    imageUrl: '',
    fixed: null
  };

  categories = [];
  showSubCategory = false;
  recurringLoading = false;
  selectedSubCategory: '';
  subCategories: ICategory[];

  dynamicPricing = true;

  isWorking = false;

  total: any;
  uploadedSubscription: Subscription;


  expCollRef: AngularFirestoreCollection<any> = this.afs.collection(
    'expense',
    ref => ref.orderBy('date', 'desc').where('date', '>=', this.startOfMonth)
  );
  expenses: Observable<Expense[]>;
  recurringExpenses = [];
  reccuringExpenseId: string = null;


  constructor(
    private afs: AngularFirestore,
    private alertCtrl: AlertController,
    private storage: AngularFireStorage,
    private settingService: SettingsService,
    private loadingCtrl: LoadingController,
    private imageService: ImageService,
    private utilService: UtilsService
  ) {
    Object.assign(this.categories, categories);
  }

  ngOnInit() {

    this.settingService.getConfig().subscribe(initialSettings => {
      this.dynamicPricing = initialSettings;
    });

    // dynamicPricing event management
    this.settingService.inputBS$.subscribe( config => {
      this.dynamicPricing = config;
    });

    this.checkRecurring();

    // this.maxDate = this.cdo.toISOString().split('T')[0]
    // this.expenses = this.expCollRef.valueChanges().pipe(map(array => {
    //   return array.map(item => {
    //     return {
    //       ...item,
    //       date: item.date.toDate()
    //     }
    //   })
    // }))

    // this.expenses.pipe(throttleTime(1500)).subscribe((values) => {
    //   new Promise((resolve, reject) => {
    //     this.total = values.reduce((prev, current, index, array) => {
    //       if(index === array.length - 1) resolve('😎')
    //       return prev + Number(current.price)
    //     }, 0)
    //   }) // Promise
    // })// forEach

  }


  public dynamicHandler(price: any): void {
    this.expense.price = price;
  }

  public addItem(form: NgForm, expense: IExpense) {
    return new Promise((resolve, reject) => {

      const newExpense = expense || this.expense;
      this.isWorking = true;
      this.imageService.cancelled$.pipe(
        take(1),
        tap(_ => this.isWorking = false)
      ).subscribe();

      this.uploadedSubscription = this.imageService.uploaded$.subscribe((resp: any) => {
        console.log('event received:uploaded:image: ');
        const expenseInstance = new Expense(newExpense.price, newExpense.note, resp.imageName, newExpense.category, newExpense.date,
          this.showSubCategory ? this.selectedSubCategory : null, newExpense.fixed
        );
        this.expCollRef
        .add({...expenseInstance})
        .then(docRef => {
          this.resetFields();
          this.isWorking = false;
          // already happens on cloud function
          // this.expCollRef.doc(docRef.id).update({
            //   id: docRef.id
            // })
            resolve(docRef);
            if(this.reccuringExpenseId) {
              this.utilService.setRecurring(true);
            }
            this.uploadedSubscription.unsubscribe();
          })
          .catch(err => {
            reject(err);
            this.isWorking = false;
            console.log(err);
            this.uploadedSubscription.unsubscribe();
          });
      });
      // Ideally we should pulish upload:image event and than a image upload
      // should happen and then listen for uploaded:image but in the case
      // when there is no image than every thing happens so fast the image upload
      // component publishes before home component have enough time to subscribe
      // to uploaded:image so event is missed
      this.imageService.setUpload(true);
    });
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
          handler: () => {

            // @ts-ignore
            this.expCollRef.doc(item.id).delete();
            // FIXME: Refactor this subscription
            if(!item.imageName) {return;}
            this.storage
              .ref(`receipts/${item.imageName}`)
              .delete()
              .subscribe(
                resp => {
                  console.log('resource deleted', resp);
                },
                error => console.log(error)
              );
          }
        }
      ]
    });
    confirm.present();
  }

  populateSubCategory(category: ICategory) {
    if (category.hasOwnProperty('subCategory') && category.subCategory) {
      this.subCategories = category.subCategory;
      this.showSubCategory = true;
    } else {
      this.showSubCategory = false;
    }
  }

  checkRecurring() {
    this.afs.collection('tasks').valueChanges()

    .subscribe(resp => {
      console.log(resp);
      this.recurringExpenses = resp.map((item: IExpense) => ({
          ...item,
          date: item.date.toDate()
        }));
    });
  }

  addRecurring(item: IExpense) {
    this.recurringLoading = true;

    if(item.fixed) {
      this.addItem(undefined, item).then(resp => {
        this.recurringLoading = false;
        this.deleteRecurring(item.id);
      });
    } else {

      this.expense = {...item};
      this.select.open();
      this.reccuringExpenseId = item.id;

      this.utilService.recurringTask$
      .pipe(take(1))
      .subscribe(resp => {
        this.deleteRecurring(item.id).finally(() => {
          this.recurringLoading = false;
          this.reccuringExpenseId = null;
        });
      });
    }
  }

  deleteRecurring(id: string): Promise<void>{
    return this.afs.collection('tasks').doc(id).delete();
  }

  addTasks() {
    const expenseInstance = new Expense(100, 'Shared Wifi Monthly Fee with neighbor', null, { title: 'bills' }, new Date(null),
      this.showSubCategory ? this.selectedSubCategory : null, true
    );

    console.log(expenseInstance);
    console.log({...expenseInstance});

    this.afs.collection('recurring').add(
      {...expenseInstance}
    ).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log(error);
    });


  }

  public addDay() {
    const tempDate = this.expense.date;
    const nextDay = addDays(tempDate, 1);
    if (isAfter(nextDay, new Date())) {return;}
    this.expenseDate.value = nextDay.toISOString();
  }

  public subtractDay() {
    const tempDate = this.expense.date;
    this.expenseDate.value = subDays(tempDate, 1).toISOString();
    console.log(this.expense.date);
  }

  resetFields() {
    this.expense.price = null;
    this.expense.note = '';
  }

  trackByFn(index, item: IExpense) {
    return item.id;
  }
}
