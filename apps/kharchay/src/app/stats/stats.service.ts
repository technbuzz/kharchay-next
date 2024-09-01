import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { collectionData, Firestore, getAggregateFromServer, sum } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { IExpense } from '@kh/common/api-interface';
import { addMonths, addWeeks, getDaysInMonth, subMonths, subWeeks } from 'date-fns';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline, arrowUpCircleOutline, arrowDownCircleOutline } from 'ionicons/icons';
import { distinctUntilKeyChanged, map, switchMap } from 'rxjs';
import { getMonthlyQuery, getWeeklyQuery } from './utils';

interface Queries {
  period: 'week' | 'month' | 'year',
  timestamp: number
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  router = inject(Router);
  route = inject(ActivatedRoute);
  http = inject(HttpClient)

  getUsers$() {
    return this.http.get('https://jsonplaceholder.typicode.com/users')
  }

  $queries = toSignal(this.route.queryParamMap.pipe(
    map(q =>
    ({
      period: q.get('period') ?? 'week',
      timestamp: Number(q.get('timestamp')) || new Date().getTime()
    }),
    ),
  ), { initialValue: { period: 'week', timestamp: new Date().getTime() } })

  $daysInPeriod = computed(() => {
    const { period, timestamp } = this.$queries()
    return period === 'week' ? 7 : getDaysInMonth(new Date(timestamp))
  })

  setQueries(params: any) {
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' })
  }


  expenses$ = toObservable(this.$queries).pipe(
    distinctUntilKeyChanged('timestamp'),
    switchMap(({ period, timestamp}) => {
      const query = this.decideQuery(period, timestamp)
      return collectionData(query)
    }),
  )



  $currTotal = toSignal(toObservable(this.$queries).pipe(
    distinctUntilKeyChanged('timestamp'),
    switchMap(({ period, timestamp}) => {
      const query = this.decideQuery(period, timestamp)
      return getAggregateFromServer(query, { total: sum('price') })
    }),
    map(v => v.data().total)
  ), { initialValue: 0 })

  $prevTotal = toSignal(toObservable(this.$queries).pipe(
    distinctUntilKeyChanged('timestamp'),
    switchMap(({ period, timestamp}) => {
      let prevPeriod = period === 'month' ? subMonths(new Date(timestamp), 1) : subWeeks(new Date(timestamp), 1)
      const query = this.decideQuery(period, prevPeriod.getTime())
      return getAggregateFromServer(query, { total: sum('price') })
    }),
    map(v => v.data().total)
  ), {initialValue: 0})

  $diffTotal = computed(() => {
    const diff = this.$currTotal() - this.$prevTotal()
    return {
      raw: diff,
      pct: Math.abs(diff / this.$prevTotal()) * 100,
      icon: diff > 0 ? 'arrow-up-circle-outline' : 'arrow-down-circle-outline',
      color: diff > 0 ? 'danger' : 'success'
    }
  })

  $expenses = toSignal(this.expenses$, { initialValue: [] })

  constructor(private afs: Firestore) {
    addIcons({
      chevronBackOutline, chevronForwardOutline, arrowUpCircleOutline, arrowDownCircleOutline
    })
  }

  decideQuery(period: string, timestamp: number) {
    return  period === 'week' ? getWeeklyQuery(this.afs, new Date(timestamp)) :
        getMonthlyQuery(this.afs, new Date(timestamp));
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
