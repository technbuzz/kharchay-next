import { Component, ViewChild, OnInit } from '@angular/core';
import { IonDatetime, Events } from "@ionic/angular";

import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";

import * as addDays from "date-fns/add_days";
import * as isAfter from 'date-fns/is_after';
import * as subDays from 'date-fns/sub_days';
import * as startOfMonth from 'date-fns/start_of_month';

import { ICategory } from '../shared/category.interface';
import { categories } from '../shared/categories';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Expense } from './expense.model';
import { IExpense } from '../shared/expense.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('expenseDate')
  expenseDate: IonDatetime;

  cdo = new Date();
  startOfMonth = startOfMonth(this.cdo);

  expense: IExpense = {
    price: null,
    note: '',
    category: null,
    date: new Date().toISOString(),
    imageName: '',
    imageUrl: ''
  };

  categories = [];
  showSubCategory: boolean = false;
  selectedSubCategory: '';
  subCategories: ICategory;

  dynamicPricing: boolean = true;

  isWorking: boolean = false;

  expCollRef: AngularFirestoreCollection<any> = this.afs.collection(
    'expense',
    ref => ref.orderBy('date', 'desc').where('date', '>=', this.startOfMonth)
  );
  expenses: Observable<Expense[]>;


  constructor(
    private events: Events,
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    Object.assign(this.categories, categories);
  }

  ngOnInit() {
    this.expenses = this.expCollRef.valueChanges();
    this.expenses.subscribe(resp => {
      console.log(resp);
      
    })
  }

  public addItem(form: NgForm) {
    this.isWorking = true;
    this.events.subscribe('uploading:cancelled', () => {
      this.isWorking = false;
      this.events.unsubscribe('uploading:cancelled');
    });

    this.events.subscribe('uploaded:image', ({ imageName, imageUrl }) => {
      this.expCollRef
        .add({
          price: this.expense.price,
          note: this.expense.note,
          category: this.expense.category,
          subCategory: this.showSubCategory ? this.selectedSubCategory : null,
          date: new Date(this.expense.date),
          imageName,
          imageUrl
        })
        .then(docRef => {
          this.resetFields();
          this.isWorking = false;
          this.expCollRef.doc(docRef.id).update({
            id: docRef.id
          })

          this.events.unsubscribe('uploaded:image');
        })
        .catch(err => {
          this.isWorking = false;
          console.log(err);
          this.events.unsubscribe('uploaded:image');
        });
    });

    //Ideally we should pulish upload:image event and than a image upload
    // should happen and then listen for uploaded:image but in the case
    // when there is no image than every thing happens so fast the image upload
    // component publishes before home component have enough time to subscribe
    // to uploaded:image so event is missed
    this.events.publish('upload:image');
  }

  public calculate() {
    if (!this.expense.price) return;

    const price = this.expense.price.toString().split('+');
    // convert string to numbers
    const numberPrice = price.map(item => {
      return parseFloat(item);
    });

    // calculate prices
    this.expense.price = numberPrice.reduce((prev, item) => {
      return prev + Number(item);
    }, 0);
  }

  populateSubCategory(category: ICategory) {
    if (category.hasOwnProperty('subCategory') && category.subCategory) {
      this.subCategories = category.subCategory;
      this.showSubCategory = true;
    } else {
      this.showSubCategory = false;
    }
  }

  public addDay() {
    let tempDate = this.expense.date;
    let nextDay = addDays(tempDate, 1);
    if (isAfter(nextDay, new Date())) return;
    this.expenseDate.value = nextDay.toISOString();
  }

  public subtractDay() {
    let tempDate = this.expense.date;
    this.expenseDate.value = subDays(tempDate, 1).toISOString();
    console.log(this.expense.date);
  }

  resetFields() {
    this.expense.price = null;
    this.expense.note = '';
  }

}
