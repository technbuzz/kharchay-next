import { computed, effect, inject, Injectable } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { IExpense } from '@kh/common/api-interface';
import { addMonths, addWeeks, getDate, getDaysInMonth, subMonths, subWeeks } from 'date-fns';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { debounceTime, map, switchMap, tap } from 'rxjs';
import { getMonthlyQuery, getWeeklyQuery } from './utils';

interface Queries {
  period: 'week' | 'month' | 'year',
  timestamp: number
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  router = inject(Router);
  route = inject(ActivatedRoute);


  $queries = toSignal(this.route.queryParamMap.pipe(
    map(q =>
    ({
      period: q.get('period') ?? 'week',
      timestamp: Number(q.get('timestamp')) || new Date().getTime()
    })
    ),
  ), { initialValue: { period: 'week', timestamp: new Date().getTime() } })

  $daysInPeriod = computed(() => {
    const { period, timestamp } = this.$queries()
    return period === 'week' ? 7 : getDaysInMonth(new Date(timestamp))
  })

  setQueries(params: any) {
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' })
  }

  expenses2$ = toObservable(this.$queries).pipe(
    // tap(v => console.log('query', v)),
    debounceTime(1000),
    switchMap(params => {
      const { period, timestamp } = params

      const query = period === 'week' ? getWeeklyQuery(this.afs, new Date(timestamp)) :
        getMonthlyQuery(this.afs, new Date(timestamp));
      return collectionData(query)
    }),
    tap(v => console.log('result', v)),

  )

  $expensesRaw = toSignal(this.expenses2$, { initialValue: [] })

  $expensesGroupedByWeek = computed(() => {
    let expenses = this.$expensesRaw()
    // @ts-ignore
    let grouped = Object.groupBy(expenses, expense => expense.date.toDate().getDay())
    return this.reduceGrouped(grouped)
  })

  $expensesGroupedByMonth = computed(() => {
    let expenses = this.$expensesRaw()
    // @ts-ignore
    let grouped = Object.groupBy(expenses, expense => getDate(expense.date.toDate()))
    return this.reduceGrouped(grouped)
  })

  expenses$ = toObservable(this.$queries).pipe(
    debounceTime(1000),
    switchMap(params => {
      const { period, timestamp } = params

      const query = period === 'week' ? getWeeklyQuery(this.afs, new Date(timestamp)) :
        getMonthlyQuery(this.afs, new Date(timestamp));
      return collectionData(query)
    }),
    map(expenses => {
      // let grouped = groupBy(expenses, (expense: IExpense) => expense.date.toDate().getMonth())
      // @ts-ignore
      // let grouped = Object.groupBy(expenses, expense => expense.date.toDate())
      let grouped = Object.groupBy(expenses, expense => getDate(expense.date.toDate()))
      return { grouped: this.reduceGrouped(grouped), ungrouped: expenses }
    }),
  )



  constructor(private afs: Firestore) {
    this.expenses2$.subscribe()
    effect(() => {
      console.log('expenseraw', this.$expensesRaw())
    })
    effect(() => {
      console.log('$groupedbymonth', this.$expensesGroupedByMonth())
    })

    effect(() => {
      console.log('$groupedbyweek', this.$expensesGroupedByWeek())
    })

    addIcons({
      chevronBackOutline, chevronForwardOutline
    })
  }

  reduceGrouped(expenses: { [key: number]: IExpense[] }): Number[] {
    let spendings = new Array(this.$daysInPeriod()).fill(0);

    for (let e in expenses) {
      let el = expenses[e]
      // @ts-ignore
      spendings[e] = el.map(item => item.price).reduce((a: number, b: number) => a + b)
    }
    return spendings
  }


  subPeriod(timestamp: number): Date {
    const period = this.$queries()?.period
    let result;
    switch (period) {
      case 'week':
        result = subWeeks(timestamp, 1)
        break;

      case 'month':
        result = subMonths(timestamp, 1)
        break;

      default:
        result = subWeeks(timestamp, 1)
        break;
    }

    return result

  }


  addPeriod(timestamp: number): Date {
    const period = this.$queries()?.period
    let result;
    switch (period) {
      case 'week':
        result = addWeeks(timestamp, 1)
        break;

      case 'month':
        result = addMonths(timestamp, 1)
        break;

      default:
        result = addWeeks(timestamp, 1)
        break;
    }

    return result

  }

}
