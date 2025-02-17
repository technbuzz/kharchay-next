import {
    AfterViewInit,
    Component, ElementRef,
    ViewChild,
    input
} from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { Observable, fromEvent, merge } from 'rxjs';
import { Stepper } from '../shared/stepper';

import {
    DocumentData,
    query,
    where
} from 'firebase/firestore';
import { endOfMonth } from 'date-fns/endOfMonth';
import { startOfMonth } from 'date-fns/startOfMonth';

import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Gesture, GestureController, IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { format } from 'date-fns/format';
import { addIcons } from "ionicons";
import { listOutline } from "ionicons/icons";
import forIn from 'lodash-es/forIn';
import groupBy from 'lodash-es/groupBy';
import reduce from 'lodash-es/reduce';
import { collectionData } from 'rxfire/firestore';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { DoughnutComponent } from './doughnut/doughnut.component';

function tranformDate(v: string) {
    return format(new Date(v), 'yyyy-MM')
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DoughnutComponent,
    RouterLink,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon
  ],
})
export class SummaryPage extends Stepper implements AfterViewInit {
  @ViewChild('dateItem') dateItem: any;
  @ViewChild('expenseDate', { static: true })
  expenseDate!: ElementRef<HTMLInputElement>;

  chartData: number[] = [];
  chartLabels: string[] = [];

  month = input<string>(format(new Date('2022-01'), 'yyyy-MM'));
  total = 0;
  month$ = toObservable(this.month)


  expenses$!: Observable<DocumentData[]>;
  private expensesRef = collection(this.afs, 'expense');
  constructor(private afs: Firestore, private gestureCtrl: GestureController) {
    super();
    addIcons({ listOutline });
  }

  ngAfterViewInit() {

    const gesture: Gesture = this.gestureCtrl.create({
      el: this.expenseDate.nativeElement,
      threshold: 15,
      direction: 'x',
      gestureName: 'swipe-x',
      // onMove: ev => this.onMoveHandler(ev),
      onStart: ev => this.onStartHandler(ev)
    }, true);

    gesture.enable()



    merge(
        fromEvent(this.expenseDate.nativeElement, 'change').pipe(
          map((v: any) => v.currentTarget.value)
        ),
        this.month$.pipe(tap(v => console.log('this.month$', v)),filter(Boolean))
    ).pipe(
      map(value => {
        const start = startOfMonth(new Date(value));
        const end = endOfMonth(new Date(value));
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

  onStartHandler(ev: any) {
    const date = this.expenseDate.nativeElement
    if (ev.deltaX > 0) {
      date.value = this.addMonth(date.value)
    } else {
      date.value = this.subMonth(date.value)
    }

    const event = new Event('change')
    date.dispatchEvent(event)
  }

  private buildQuery(value: { start: Date, end: Date }) {
    const expensesQuery = query(
      this.expensesRef,
      where('date', '>=', value.start),
      where('date', '<=', value.end)
    );
    // 8001717,
    return expensesQuery
  }


  loadBasic() {
    const basicStartMonth = startOfMonth(new Date(this.month()));
    const basicEndMonth = endOfMonth(new Date(this.month()));

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
