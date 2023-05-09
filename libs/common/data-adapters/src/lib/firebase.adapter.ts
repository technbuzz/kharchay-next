import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { addDoc, updateDoc, collectionData, collection, Firestore, doc, query, where } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { DatabaseAdapter } from './database.adapter';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { getDocs, limit, orderBy } from 'firebase/firestore';
// import { collection, Firestore } from 'firebase/firestore';
import forIn from 'lodash-es/forIn';
import groupBy from 'lodash-es/groupBy';
import reduce from 'lodash-es/reduce';
import sortBy from 'lodash-es/sortBy'
import take from 'lodash-es/take'


@Injectable({ providedIn: 'root' })
export class FirebaseAdapterService implements DatabaseAdapter {
  constructor(private http: HttpClient, private fbAuth: Auth, private firestore: Firestore) {
  }

  async signIn(data: { email: string, password: string }) {
    await signInWithEmailAndPassword(this.fbAuth, data.email, data.password);
  }

  async signOut(): Promise<void> {
    return this.fbAuth.signOut()
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

  summaryByMonth(collectionName: string, startDate:Date, endDate: Date) {
    const ref = collection(this.firestore, collectionName)

    const expensesQuery = query(
      ref,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    return collectionData(expensesQuery).pipe(
      map(this.generateDataForChart)
    )
    // const docs = await getDocs(expensesQuery)
    // docs.forEach((doc) => {
    //   console.log(doc.id, doc.data())
    // })
  }

  private generateDataForChart(values: any) {
    const chartData: number[] = [];
    const chartLabels: string[] = [];


    // FIXME: Replace lodash with groupBy rxjs function
    // Backward compat becuse new format is {category:{title:'food'}}

    // FIXME : These operation probably needs to be done on Server side
    const grouped = groupBy(values, (item:any) =>
      item.category.title ? item.category.title : item.category
    );

    const rawValues : Array<{key: string; value: number}> = []
    forIn(grouped, (value, key) => {
      const total = reduce(value, (sum, n) => sum + Number(n.price), 0);
      rawValues.push({key, value: total})
    });

    const normalized = take(sortBy(rawValues, [(o) => -o.value]), 3)
    normalized.forEach(item => {
      chartLabels.push(item.key.toUpperCase());
      chartData.push(item.value);
    })
    return { chartData, chartLabels }
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
    return collectionData(newQuery)
  }

}
