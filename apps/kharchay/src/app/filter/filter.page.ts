import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { collection, collectionData, collectionGroup, deleteDoc, doc, Firestore, getAggregateFromServer, getDocs, orderBy, sum, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { query} from '@firebase/firestore';
import { IonDatetime } from '@ionic/angular';
import {endOfMonth} from 'date-fns/endOfMonth';
import {isBefore} from 'date-fns/isBefore';
import {startOfMonth} from 'date-fns/startOfMonth';
import {lightFormat} from 'date-fns/lightFormat';
import {parseISO} from 'date-fns/parseISO';
import {parse} from 'date-fns/parse';

import { Observable, map } from 'rxjs';
import { BaseExpense } from '../home/expense-base.model';
import { categories } from '../shared/categories';
import { Stepper } from '../shared/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { IExpense } from '@kh/common/api-interface';
import { SettingsService } from '../services/settings.service';


@Component({
  selector: 'kh-filter',
  templateUrl: './filter.page.html',

  styleUrls: ['./filter.page.scss'],
})
export class FilterPage extends Stepper implements OnInit{

  @ViewChild(IonDatetime, { static: true }) datetime!: IonDatetime;


  settingService = inject(SettingsService)
  $configs = toSignal(this.settingService.getConfig())
  categories: any = [];

  searchType = 'basic';
  filter = {
    startDate: '',
    endDate: '',
    category: '',
    month: new Date().toISOString()
  };

  expenses$!: Observable<BaseExpense[]>;
  expRef: any;
  total = 0;


  constructor(private route: ActivatedRoute, private router: Router, private afs: Firestore) {
    super();
    Object.assign(this.categories, categories);
   }

  ngOnInit() {
    const date = this.route.snapshot.params['id']
    if(date) {
      this.filter.month = parse(date, 'yyyy-MM', new Date()).toISOString()
    }
    this.loadBasic();
  }

  async fixPrice() {
    const batcher = writeBatch(this.afs)

    const basicStartMonth = startOfMonth(new Date(this.filter.month));
    const basicEndMonth = endOfMonth(new Date(this.filter.month));
    const expenseGroup = collection(this.afs, 'expense')
    const expenseQuery = query(
      expenseGroup,
      where('date', '>=', basicStartMonth),
      where('date', '<=', basicEndMonth),
    )

    // const resp = await deleteDoc(doc(this.afs, `expense/${item.id}`))
    collectionData(expenseQuery, { idField: 'id' }).subscribe(expense => {
      expense.forEach(item => {
        console.log(item)
        batcher.update(doc(this.afs, `expense/${item.id}`), {
          price: Number(item['price'])
        })
      })

    })


    const resp = await batcher.commit()
    console.log('batch updated', resp)

  }


  public loadBasic() {
    const basicStartMonth = startOfMonth(new Date(this.filter.month));
    const basicEndMonth = endOfMonth(new Date(this.filter.month));

    this.loadResults({startDate: basicStartMonth.toISOString(), endDate: basicEndMonth.toISOString()});

    const ref = collection(this.afs, 'expense');
    this.expRef = query(ref,
      where('date', '>=', basicStartMonth),
      where('date', '<=', basicEndMonth)
    );


    // Finding Total
    this.findTotal();
    // this.findTest()
  }

  async fixPriceItem(item: IExpense) {
    const resp = await updateDoc(doc(this.afs, `expense/${item.id}`), {
      price: Number(item.price)
    })

    console.log('updated', resp)


  }

  public loadResults(event:any) {
    // Remove following lines after tesing
    if (event && event.startDate && event.endDate) {
      this.filter.startDate = event.startDate;
      this.filter.endDate = event.endDate;
    }

    if (!this.filter.startDate || !this.filter.endDate || !this.filter.category) {
      return;
    }

    if (isBefore(new Date(this.filter.endDate), new Date(this.filter.startDate))) {
      // this.toastCtrl.create({
      //   message: 'Note: Start Date cannot be set in the future.',
      //   position: 'bottom',
      //   showCloseButton: true
      // }).present();

      return;
    }

    const ref = collection(this.afs, 'expense');
    this.expRef = query(ref,
      where('date', '>=', new Date(this.filter.startDate)),
      where('date', '<=', new Date(this.filter.endDate)),
      where('category', '==', this.filter.category),
      orderBy('date', 'desc')
    );
    this.findTotal();


  }

  async findTest() {
    const querySnapshot = await getDocs(this.expRef);
    console.log(querySnapshot)
    querySnapshot.forEach((doc) => {

      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });

  }

  async findTotal() {
    const snapshot = await getAggregateFromServer(this.expRef, {
      total: sum('price')
    })

    this.total = snapshot.data().total
    this.expenses$ = collectionData(this.expRef, { idField: 'id' })

    // collectionData(this.expRef).pipe(
    //   map((v:any) => {
    //     return v.map((v: any) => ({...v, date: v.date.toDate()}))
    //   }),
    //   map(v => groupBy(v, 'date'))
    // ).subscribe(v => {
    //   console.log(v)
    // })
  }

  async deleteExpense(item: IExpense) {
    if(this.$configs()?.deleteRights) {
      const resp = await deleteDoc(doc(this.afs, `expense/${item.id}`))
      console.log(item.id, resp, 'deleted')
    }
    console.log('No Delete rights')
  }

  navigateToGraph() {
    this.router.navigate(["/summary", lightFormat(parseISO(this.filter.month), 'yyyy-MM')])
  }

}
