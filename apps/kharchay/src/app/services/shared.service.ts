import { Injectable } from '@angular/core';
import { IExpense } from '@kh/common/api-interface';
import { addDoc, collection, Firestore } from 'firebase/firestore';

@Injectable({providedIn: 'root'})
export class SharedService {
  constructor(private firestore: Firestore) { }
  

  add(expense: IExpense) {
    return addDoc(collection(this.firestore, 'expense'), expense);
  }
}