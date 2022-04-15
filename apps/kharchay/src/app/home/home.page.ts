import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, firestoreInstance$, getFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { AlertController, GestureController, IonDatetime, IonSelect, LoadingController } from '@ionic/angular';
import { formatISO, parseISO } from 'date-fns';
// import { AngularFireStorage, getStorage, Storage, ref,  } from '@angular/fire/storage';
import addDays from 'date-fns/esm/addDays';
import format from 'date-fns/esm/format';
import isAfter from 'date-fns/esm/isAfter';
import startOfMonth from 'date-fns/esm/startOfMonth';
import { Observable, Subscription } from 'rxjs';
import { concatMap, first, take, tap } from 'rxjs/operators';
import { ImageService } from '../services/image.service';
import { SettingsService } from '../services/settings.service';
import { UtilsService } from '../services/utils.service';
import { categories } from '../shared/categories';
import { ICategory } from '../shared/category.interface';
import { Expense } from '../shared/expense.class';
import { IExpense } from '../shared/expense.interface';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  @ViewChild('dateItem') dateItem: any;
  @ViewChild(IonDatetime) datetime!: IonDatetime;
  @ViewChild(IonSelect, { static: true }) select!: IonSelect;
  @ViewChild('gestureTest') gestureTest!: ElementRef;

  cdo = new Date();
  currentMonth = format(new Date(), 'MMMM');
  startOfMonth = startOfMonth(this.cdo);
  maxDate = formatISO(new Date());

  app = getFirestore().app;

  expense: any = {
    price: null,
    note: '',
    category: null,
    date: formatISO(new Date()),
    imageName: '',
    imageUrl: '',
    fixed: null
  };

  categories: any[] = [];
  showSubCategory = false;
  recurringLoading = false;
  selectedSubCategory!: '';
  subCategories!: ICategory[];

  dynamicPricing = true;

  isWorking = false;

  total: any;
  uploadedSubscription!: Subscription;

  expCollRef = firestoreInstance$.pipe(
    first(),
    concatMap(firestore => collectionData(collection(firestore, 'expense')))
  );
  expenses!: Observable<Expense[]>;
  recurringExpenses = [];
  reccuringExpenseId: string|undefined = undefined;


  constructor(
    // private afs: AngularFirestore,
    private alertCtrl: AlertController,
    // private storage: Storage,
    private firestore: Firestore,
    private settingService: SettingsService,
    private loadingCtrl: LoadingController,
    private imageService: ImageService,
    private utilService: UtilsService,
    private gestureCtrl: GestureController
  ) {
    Object.assign(this.categories, categories);
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

  ngAfterViewInit() {

    const gesture = this.gestureCtrl.create({
      el: this.dateItem.el,
      gestureName: 'move',
      onEnd: detail => {
        const type = detail.type;
        const currentX = detail.currentX;
        const deltaX = detail.deltaX;
        const velocityX = detail.velocityX;
        if (deltaX > 0) {
          this.addDay();
        } else {
          this.subtractDay();
        }
      }
    });

    gesture.enable();
  }

  formatDate(event: any) {
    // console.log('value: ', value);
    this.expense.date = format(parseISO(event.detail.value), 'MMM dd yyyy');
  }


  public dynamicHandler(price: any): void {
    this.expense.price = price;
  }

  public async addItem(form: NgForm, expense: IExpense | undefined) {
    return new Promise((resolve, reject) => {
      const newExpense = expense || this.expense;
      this.isWorking = true;
      this.imageService.cancelled$.pipe(
        take(1),
        tap(_ => this.isWorking = false)
      ).subscribe();

      this.uploadedSubscription = this.imageService.uploaded$.subscribe(async (resp: any) => {
        console.log('event received:uploaded:image: ');
        // FIXME:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const expenseInstance = new Expense(newExpense.price, newExpense.note, resp.imageName, newExpense.category, newExpense.date,
          this.showSubCategory ? this.selectedSubCategory : null, newExpense.fixed
        );
        const ref = await addDoc(collection(this.firestore, 'expense'), {...expenseInstance});
        console.log('ref: ', ref.id);
        this.resetFields();
        this.isWorking = false;
        if (this.recurringExpenses) {
          this.utilService.setRecurring(true);
        }
        this.uploadedSubscription.unsubscribe();
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
          handler: () => this.deleteResource(item)
        }
      ]
    });
    confirm.present();
  }


// FIXME:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
  populateSubCategory(category: ICategory) {
    if (category.subCategory && category.subCategory) {
      this.subCategories = category.subCategory;
      this.showSubCategory = true;
    } else {
      this.showSubCategory = false;
    }
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

      this.expense = { ...item };
      this.select.open();
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
    const expenseInstance = new Expense(100, 'Shared Wifi Monthly Fee with neighbor', null, { title: 'bills' }, new Date(null),
      this.showSubCategory ? this.selectedSubCategory : null, true
    );

    try {
      const response = await addDoc(collection(this.firestore, 'recurring'), { ...expenseInstance });
      console.log('response: ', response);
    } catch (error) {
      console.log('error: ', error);
    }
  }

  public async addDay() {
    const tempDate = new Date(this.expense.date);
    const nextDay = addDays(tempDate, 1);
    if (isAfter(nextDay, new Date())) { return; }
    this.expense.date = nextDay.toISOString();
  }

  public subtractDay() {
    const tempDate = new Date(this.expense.date);
    // this.expenseDate.value = subDays(tempDate, 1).toISOString();
  }

  resetFields() {
    this.expense.price = null;
    this.expense.note = '';
  }

  trackByFn(index:any, item: IExpense) {
    return item.id;
  }
}
// 304 lines