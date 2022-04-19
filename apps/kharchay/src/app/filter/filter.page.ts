import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import startOfMonth from 'date-fns/esm/startOfMonth';
import endOfMonth from 'date-fns/esm/endOfMonth';
import isBefore from 'date-fns/esm/isBefore';
import { collection, collectionData, Firestore, where } from '@angular/fire/firestore';
import { GestureController, IonDatetime } from '@ionic/angular';
import { Observable } from 'rxjs';
import { BaseExpense } from '../home/expense-base.model';
import { Stepper } from '../shared/stepper';
import { categories } from '../shared/categories';
import { map } from 'rxjs/operators';
import { query } from '@firebase/firestore';


@Component({
  selector: 'kh-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage extends Stepper implements OnInit, AfterViewInit {

  // @ViewChild(IonDatetime) expenseMonth: IonDatetime;
  // @ViewChild('dateItem') dateItem: any;
  // @ViewChild('expenseMonth') datetime: IonDatetime;
  @ViewChild(IonDatetime, { static: true }) datetime!: IonDatetime;



  categories: any = [];

  searchType = 'basic';
  filter = {
    startDate: '',
    endDate: '',
    category: '',
    month: new Date().toISOString()
  };

  expenses$!: Observable<BaseExpense[]>;
  expRef: any;
  total = 0;


  constructor(private afs: Firestore, private gestureCtrl: GestureController) {
    super();
    Object.assign(this.categories, categories);

   }

  ngOnInit() {
    this.loadBasic();
  }

  ngAfterViewInit() {
    // const gesture = this.gestureCtrl.create({
    //   el: this.dateItem.el,
    //   gestureName: 'move',
    //   onEnd: detail => {
    //     const type = detail.type;
    //     const currentX = detail.currentX;
    //     const deltaX = detail.deltaX;
    //     const velocityX = detail.velocityX;
    //     if (deltaX > 0) {
    //       this.filter.month = this.addMonth(this.filter.month);
    //       // this.addMonth(this.filter.month, this.dateItem.el);
    //     } else {
    //       this.filter.month = this.subMonth(this.filter.month);
    //       // this.subMonth(this.filter.month, this.dateItem.el);

    //     }

    //   }
    // });
    console.log('expensemonth', this.datetime)
    // gesture.enable();
  }

  public loadBasic() {
    const basicStartMonth = startOfMonth(new Date(this.filter.month));
    const basicEndMonth = endOfMonth(new Date(this.filter.month));

    this.loadResults({startDate: basicStartMonth.toISOString(), endDate: basicEndMonth.toISOString()});

    const ref = collection(this.afs, 'expense');
    this.expRef = query(ref,
      where('date', '>=', basicStartMonth),
      where('date', '<=', basicEndMonth)
    );

    // this.expRef = this.afs.collection('expense', ref =>
    //   ref
    //     .where('date', '>=', basicStartMonth)
    //     .where('date', '<=', basicEndMonth)
    // );

    // Finding Total
    this.findTotal();
  }

  public loadResults(event:any) {
    // Remove following lines after tesing
    if (event && event.startDate && event.endDate) {
      this.filter.startDate = event.startDate;
      this.filter.endDate = event.endDate;
    }

    if (!this.filter.startDate || !this.filter.endDate || !this.filter.category) {
      return;
    }

    if (isBefore(new Date(this.filter.endDate), new Date(this.filter.startDate))) {
      // this.toastCtrl.create({
      //   message: 'Note: Start Date cannot be set in the future.',
      //   position: 'bottom',
      //   showCloseButton: true
      // }).present();

      return;
    }

    const ref = collection(this.afs, 'expense');
    this.expRef = query(ref,
      where('date', '>=', new Date(this.filter.startDate)),
      where('date', '<=', new Date(this.filter.endDate)),
      where('category', '==', this.filter.category)
    );



    // this.expRef = this.afs.collection('expense', ref =>
    //   ref
    //     .where('date', '>=', new Date(this.filter.startDate))
    //     .where('date', '<=', new Date(this.filter.endDate))
    //     .where('category', '==', this.filter.category)
    // );

    // Finding Total
    this.findTotal();
  }

  findTotal() {
    this.expenses$ = collectionData(this.expRef)
      .pipe(map(value => value.map(item => ({
            ...item,
            date: item['date'].toDate()
          })))) as Observable<BaseExpense[]>;

    this.expenses$.forEach(values => {
      this.total = values.reduce((prev, current) => prev + Number(current.price), 0);
    });
    // this.expenses$ = this.expRef.valueChanges().
    //   pipe(map(value => value.map(item => ({
    //         ...item,
    //         date: item.date.toDate()
    //       }))));

    // this.expenses$.forEach(values => {
    //   this.total = values.reduce((prev, current) => prev + Number(current.price), 0);
    // });
  }

}
