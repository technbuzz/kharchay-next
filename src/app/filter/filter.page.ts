import { Component, OnInit, ViewChild } from '@angular/core';
import startOfMonth from 'date-fns/esm/startOfMonth';
import endOfMonth from 'date-fns/esm/endOfMonth';
import isBefore from 'date-fns/esm/isBefore';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IonDatetime } from '@ionic/angular';
import { Observable } from 'rxjs';
import { BaseExpense } from '../home/expense-base.model';
import { Stepper } from '../shared/stepper';
import { categories } from '../shared/categories';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage extends Stepper implements OnInit {

  @ViewChild(IonDatetime) expenseMonth: IonDatetime;
  categories: any = [];

  searchType = 'basic';
  filter = {
    startDate: '',
    endDate: '',
    category: '',
    month: new Date().toISOString()
  };

  expenses$: Observable<BaseExpense[]>;
  expRef: AngularFirestoreCollection<any>;
  total = 0;


  constructor(private afs: AngularFirestore) {
    super();
    Object.assign(this.categories, categories);

   }

  ngOnInit() {
    this.loadBasic();
  }

  public loadBasic() {
    const basicStartMonth = startOfMonth(new Date(this.filter.month));
    const basicEndMonth = endOfMonth(new Date(this.filter.month));

    this.loadResults({startDate: basicStartMonth.toISOString(), endDate: basicEndMonth.toISOString()});

    this.expRef = this.afs.collection('expense', ref =>
      ref
        .where('date', '>=', basicStartMonth)
        .where('date', '<=', basicEndMonth)
    );

    // Finding Total
    this.findTotal();
  }

  public loadResults(event = null) {
    // Remove following lines after tesing
    if (event.startDate && event.endDate) {
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


    this.expRef = this.afs.collection('expense', ref =>
      ref
        .where('date', '>=', new Date(this.filter.startDate))
        .where('date', '<=', new Date(this.filter.endDate))
        .where('category', '==', this.filter.category)
    );

    // Finding Total
    this.findTotal();
  }

  findTotal() {
    this.expenses$ = this.expRef.valueChanges().
      pipe(map(value => value.map(item => ({
            ...item,
            date: item.date.toDate()
          }))));

    this.expenses$.forEach(values => {
      this.total = values.reduce((prev, current) => prev + Number(current.price), 0);
    });
  }

}
