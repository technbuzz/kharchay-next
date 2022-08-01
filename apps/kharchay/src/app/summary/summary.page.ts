import {
  AfterViewInit,
  Component, ElementRef, OnInit,
  ViewChild
} from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { fromEvent, Observable } from 'rxjs';
import { Stepper } from '../shared/stepper';

import {
  DocumentData,
  query,
  where
} from '@firebase/firestore';
import endOfMonth from 'date-fns/esm/endOfMonth';
import startOfMonth from 'date-fns/esm/startOfMonth';

import forIn from 'lodash-es/forIn';
import groupBy from 'lodash-es/groupBy';
import reduce from 'lodash-es/reduce';
import { collectionData } from 'rxfire/firestore';
import { map, switchMap } from 'rxjs/operators';
import format from 'date-fns/esm/format'


@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage extends Stepper implements AfterViewInit {
  @ViewChild('dateItem') dateItem: any;
  @ViewChild('expenseDate', { static: true })
  expenseDate!: ElementRef<HTMLInputElement>;

  chartData: number[] = [];
  chartLabels: string[] = [];

  month = format(new Date(), 'yyyy-MM')
  // month = new Date().toISOString();
  total = 0;

  expenses$!: Observable<DocumentData[]>;
  private expensesRef = collection(this.afs, 'expense');
  constructor(private afs: Firestore) {
    super();
  }
  
  ngAfterViewInit() {
    console.log('month', format(new Date(), 'yyyy-MM'))
    fromEvent(this.expenseDate.nativeElement, 'change').pipe(
      map(( value: any ) => value.currentTarget.value),
      map(value => {
        const start = startOfMonth(new Date(value));
        const end = endOfMonth(new Date(this.month));
        return { start, end }
      }),
      map(value => this.buildQuery(value)),
      switchMap(value => collectionData(value))
    ).subscribe((event) => {
      // FIXME: The below could be made reactive but we need to release
      // feature first and iterate later
      this.generateDataForChart(event)
    })
  }

  private buildQuery(value: {start: Date, end: Date}) {
    const expensesQuery = query(
      this.expensesRef,
      where('date', '>=', value.start),
      where('date', '<=', value.end)
    );
// 8001717, 
    return expensesQuery
  }


  loadBasic() {
    const basicStartMonth = startOfMonth(new Date(this.month));
    const basicEndMonth = endOfMonth(new Date(this.month));

    const expensesQuery = query(
      this.expensesRef,
      where('date', '>=', basicStartMonth),
      where('date', '<=', basicEndMonth)
    );

    // Finding Total
    this.expenses$ = collectionData(expensesQuery);
    this.expenses$.forEach((values) => {
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
    const grouped = groupBy(values, (item) =>
      item.category.title ? item.category.title : item.category
    );

    forIn(grouped, (value, key, item) => {
      this.chartLabels.push(key.toUpperCase());
      this.chartData.push(reduce(value, (sum, n) => sum + Number(n.price), 0));
    });
  }

}
