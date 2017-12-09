import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { Expense } from "./expense.model";
import { categories } from "../../shared/categories";
import { firestore } from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  
  expense = {
    price: '',
    note: '',
    category: ''
  };
  categories = [];
  expCollRef: AngularFirestoreCollection<any> = this.afs.collection('expense');
  expenses: Observable<Expense[]>;
  
  constructor(public navCtrl: NavController, public afs: AngularFirestore) {
    Object.assign(this.categories, categories);
    
  }
  
  ngOnInit(): void {
    this.expenses = this.expCollRef.valueChanges(); 
  }

  ionViewDidLoad(){
    console.log(this);
    
  }

  public addItem(){
    console.log(this.expense.category);
    return false;
    this.expCollRef.add({
      price: this.expense.price,
      note: this.expense.note,
      category: this.expense.category,
      date: new Date()
    }).then((docRef)=>{
      this.expCollRef.doc(docRef.id).update({
        id: docRef.id
      })      
    }).catch((err)=>{
      console.log(err);
    })
  }

  public update(expense: Expense){
    this.expCollRef.doc(expense.id).update({
      productName: 'changed Name',
      productDescription: 'changed Description'
    }).then((value) => {
      console.log(value);
    }).catch(err => console.log(err))
  }

  public delete(){
    this.expCollRef.doc('yourid').delete();
  }

  public search(){
    this.navCtrl.push('SearchPage')
  }

}
