import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { Stepper } from '../shared/stepper';
import { collection, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BaseExpense } from '../home/expense-base.model';


// import { groupBy, forIn, reduce } from 'lodash';
import groupBy from 'lodash-es/groupBy';
import forIn  from 'lodash-es/forIn';
import reduce from 'lodash-es/reduce';
import startOfMonth from 'date-fns/esm/startOfMonth';
import endOfMonth from 'date-fns/esm/endOfMonth';
import { GestureController, IonDatetime } from '@ionic/angular';
import { collectionData } from 'rxfire/firestore';
import { CollectionReference, DocumentData, query, where } from '@firebase/firestore';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage extends Stepper implements OnInit, AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  @ViewChild('dateItem') dateItem: any;
  @ViewChild('expenseMonth', { static: true })
  expenseMonth!: IonDatetime;

  chartData: number[] = [];
  chartLabels: string[] = [];

  month = new Date().toISOString();
  loading = true;
  total = 0;
  expRef!: CollectionReference<any>;

  expenses$!: Observable<DocumentData[]>;
  constructor(
    private afs: Firestore,
    private gestureCtrl: GestureController
  ) {
    super();
  }

  ngOnInit() {
    this.loadBasic();
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
          // this.addMonth(this.month, this.expenseMonth);
        } else {
          // this.subMonth(this.month, this.expenseMonth);
        }
      }
    });

    gesture.enable();
  }

  loadBasic() {
    const basicStartMonth = startOfMonth(new Date(this.month));
    const basicEndMonth = endOfMonth(new Date(this.month));

    this.loading = true;
    const expensesRef = collection(this.afs, 'expense');
    const expensesQuery = query(expensesRef, where('date', '>=', basicStartMonth),where('date', '<=', basicEndMonth));

    // this.expRef = collection(this.afs, 'expense', ref =>
    //   ref
    //     .where('date', '>=', basicStartMonth)
    //     .where('date', '<=', basicEndMonth)
    // );

    // Finding Total
    this.expenses$ = collectionData(expensesQuery);
    // this.expenses$ = this.expRef.valueChanges();
    this.expenses$.forEach(values => {
      this.generateDataForChart(values);
    });
  }

  generateDataForChart(values: any) {

    this.chartData = [];
    this.chartLabels = [];


    // Previously for format like {category:'food'}
    // grouped = lodash.groupBy(values, ('category.title'));

    // FIXME: Replace lodash with groupBy rxjs function
    // Backward compat becuse new format is {category:{title:'food'}}
    const grouped = groupBy(values, (item) => item.category.title ? item.category.title : item.category);

    forIn(grouped, (value, key, item) => {
      this.chartLabels.push(key.toUpperCase());
      this.chartData.push(reduce(
        value, (sum, n) => sum + Number(n.price), 0)
      );
    });

  }

}
