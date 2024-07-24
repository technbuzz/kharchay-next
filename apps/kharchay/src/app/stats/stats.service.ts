import { inject, Injectable } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { IExpense } from '@kh/common/api-interface';
import { endOfWeek, startOfWeek } from 'date-fns';
import { collection, query, where } from 'firebase/firestore';
import { debounceTime, map, switchMap } from 'rxjs';

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

  setQueries(params: any) {
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' })
  }

  expenses$ = toObservable(this.$queries).pipe(
      debounceTime(1000),
      switchMap(params => {
        const expenseGroup = collection(this.afs, 'expense')
        const basicStartMonth = startOfWeek(params.timestamp);
        const basicEndMonth = endOfWeek(params.timestamp);
        const expenseQuery = query(
            expenseGroup,
            where('date', '>=', basicStartMonth),
            where('date', '<=', basicEndMonth),
        )
        return collectionData(expenseQuery, { idField: 'id' })
      }),
      map(expense => {
        // @ts-ignore
        return Object.groupBy(expense, expense => expense.date.toDate().getDay())
      }),
      map((expenses: { [key: number]: IExpense[]} ) => {
        let spendings = new Array(7).fill(0);

        for(let e in expenses) {
          let el = expenses[e]
          // @ts-ignore
          spendings[e] = el.map(item => item.price).reduce((a:number, b: number) => a +b)
        }
        return spendings

      }),
    )


  constructor(private afs: Firestore) {

  }





}
