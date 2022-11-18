import { Component, OnInit, ViewChild } from '@angular/core';
import { collection, collectionData, Firestore, where } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { IonDatetime } from '@ionic/angular';
import endOfMonth from 'date-fns/esm/endOfMonth';
import isBefore from 'date-fns/esm/isBefore';
import startOfMonth from 'date-fns/esm/startOfMonth';
import lightFormat from 'date-fns/esm/lightFormat';
import parseISO from 'date-fns/esm/parseISO';

import { Observable } from 'rxjs';
import { BaseExpense } from '../home/expense-base.model';
import { categories } from '../shared/categories';
import { Stepper } from '../shared/stepper';
import { Router } from '@angular/router';


@Component({
  selector: 'kh-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage extends Stepper implements OnInit{

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


  constructor(private router: Router, private afs: Firestore) {
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

    const ref = collection(this.afs, 'expense');
    this.expRef = query(ref,
      where('date', '>=', basicStartMonth),
      where('date', '<=', basicEndMonth)
    );


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
    this.findTotal();
  }

  findTotal() {
    this.expenses$ = collectionData(this.expRef)
      // .pipe(map(value => value.map(item => ({
      //       ...item,
      //       date: item['date'].toDate()
      //     })))) as Observable<BaseExpense[]>;

    this.expenses$.forEach(values => {
      this.total = values.reduce((prev, current) => prev + Number(current.price), 0);
    });
  }

  navigateToGraph() {
    this.router.navigate(["/summary", lightFormat(parseISO(this.filter.month), 'yyyy-MM')])
  }

}
