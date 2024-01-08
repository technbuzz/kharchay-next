import { Component, OnInit, ViewChild } from '@angular/core';
import { collection, collectionData, Firestore, getCountFromServer, where } from '@angular/fire/firestore';
import { query, count } from '@firebase/firestore';
import { IonDatetime } from '@ionic/angular';
import {endOfMonth} from 'date-fns/endOfMonth';
import {isBefore} from 'date-fns/isBefore';
import {startOfMonth} from 'date-fns/startOfMonth';
import {lightFormat} from 'date-fns/lightFormat';
import {parseISO} from 'date-fns/parseISO';
import {parse} from 'date-fns/parse';

import { Observable } from 'rxjs';
import { BaseExpense } from '../home/expense-base.model';
import { categories } from '../shared/categories';
import { Stepper } from '../shared/stepper';
import { ActivatedRoute, Router } from '@angular/router';


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


  constructor(private route: ActivatedRoute, private router: Router, private afs: Firestore) {
    super();
    Object.assign(this.categories, categories);
   }

  ngOnInit() {
    const date = this.route.snapshot.params['id']
    if(date) {
      this.filter.month = parse(date, 'yyyy-MM', new Date()).toISOString()
    }
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

  async findTotal() {
    const snapshot = await getCountFromServer(this.expRef)

    this.total = snapshot.data().count
    this.expenses$ = collectionData(this.expRef)
      // .pipe(map(value => value.map(item => ({
      //       ...item,
      //       date: item['date'].toDate()
      //     })))) as Observable<BaseExpense[]>;

    // this.expenses$.forEach(values => {
    //   this.total = values.reduce((prev, current) => prev + Number(current.price), 0);
    // });
  }

  navigateToGraph() {
    this.router.navigate(["/summary", lightFormat(parseISO(this.filter.month), 'yyyy-MM')])
  }

}
