import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { addDoc, updateDoc, collectionData, collection, Firestore, doc, query, where } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { DatabaseAdapter } from './database.adapter';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { limit, orderBy } from 'firebase/firestore';
// import { collection, Firestore } from 'firebase/firestore';


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
