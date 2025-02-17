import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { collection, collectionData, doc, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { limit, orderBy } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { DatabaseAdapter } from './database.adapter';
// import { collection, Firestore } from 'firebase/firestore';
import forIn from 'lodash-es/forIn';
import groupBy from 'lodash-es/groupBy';
import reduce from 'lodash-es/reduce';
import sortBy from 'lodash-es/sortBy';
import take from 'lodash-es/take';


@Injectable({ providedIn: 'root' })
export class FirebaseAdapterService implements DatabaseAdapter {
  constructor(private http: HttpClient, private fbAuth: Auth, private firestore: Firestore) {
  }

  async signIn(data: { email: string, password: string }) {
    await signInWithEmailAndPassword(this.fbAuth, data.email, data.password);
  }

  signOut(): Promise<void> {
    return this.fbAuth.signOut()
  }

  signOutVoid(): void {
    this.fbAuth.signOut()
  }

  getRecurring(collectionName: string): Observable<[]> {
    const recurringColl = collection(this.firestore, 'recurring')
    return collectionData(recurringColl)
      .pipe(
        map((array: any) => {
          return array.map((item: any) => ({
            ...item,
            date: item.date.toDate()
          })
          ) // map
        })// map
      ) // pipe
  }

  summaryByMonth(collectionName: string, startDate: Date, endDate: Date) {
    const ref = collection(this.firestore, collectionName)

    const expensesQuery = query(
      ref,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    // const stream$ =
    return collectionData(expensesQuery).pipe(
      // tap((x: any) => console.log('summaryByMonth', x)),
      // // rxGroupBy((e: IExpense) => e.category.title ? e.category.title : e.category),
      // // return from(stream$).pipe(
      //
      // concatMap((e: any) => from(e)),
      // rxGroupBy((e: any) => e.category.title),
      // mergeMap(group => group.pipe(
      //   tap((x: any) => console.log('beforeMergeMap', x)),
      //   toArray(),
      //   // tap((x: any) => console.log('beforeMergeMap', x)),
      //   map(item => {
      //     console.log(item)
      //     const key = item[0].category.title
      //     return { [key]: item.reduce((acc, next) => acc + Number(next.price), 0) }
      //   })
      //   )
      // ),
      //
      // tap((x: any) => console.log('afterMergeMap', x)),

      map(this.generateDataForChart),
    )

    // const docs = await getDocs(expensesQuery)
    // docs.forEach((doc) => {
    //   console.log(doc.id, doc.data())
    // })
  }

  private generateDataForChart(values: any): Array<{ key: string; value: number }> {
    // const chartData: number[] = [];
    // const chartLabels: string[] = [];


    // FIXME: Replace lodash with groupBy rxjs function
    // Backward compat becuse new format is {category:{title:'food'}}

    // FIXME : These operation probably needs to be done on Server side
    const grouped = groupBy(values, (item: any) =>
      item.category.title ? item.category.title : item.category
    );


    const rawValues: Array<{ key: string; value: number }> = []

    forIn(grouped, (value, key) => {
      const total = reduce(value, (sum, n) => sum + Number(n.price), 0);
      rawValues.push({ key, value: total })
    });


    const normalized = take(sortBy(rawValues, [(o) => -o.value]), 3)
    return sortBy(rawValues, [(o) => -o.value])
    // return sortBy(rawValues, [(o) => -o.value])
    // console.log({normalized})
    // normalized.forEach(item => {
    //   chartLabels.push(item.key.toUpperCase());
    //   chartData.push(item.value);
    // })
    // return { chartData, chartLabels }
  }

  updateDoc(collectionName: string, id: string, body: any): Promise<void> {
    return updateDoc(doc(this.firestore, collectionName, id), body)
  }

  recentTransactions() {
    const ref = collection(this.firestore, 'expense');
    const newQuery = query(ref,
      // where('date', '<=', new Date()),
      orderBy('date', 'desc'),
      limit(5)
      // where('date', '>=', new Date(this.filter.endDate)),
      // where('category', '==', this.filter.category)
    );
    return collectionData(newQuery).pipe(
      catchError(() => of([]))
    )
  }

}
