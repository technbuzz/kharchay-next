import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collectionData, collection, query, where } from '@angular/fire/firestore';
import { UntypedFormControl, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import groupBy from "lodash-es/groupBy";
import { map, mergeAll, pluck } from 'rxjs/operators';
import { IEvent } from '../../shared/event.interface';
import { GeneralService } from '../../shared/general.service';
import { JsonPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IExpense } from '@models';


@Component({
    selector: 'kha-reports-list',
    templateUrl: './reports-list.component.html',
    styleUrls: ['./reports-list.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatDatepickerModule, ReactiveFormsModule, JsonPipe]
})
export class ReportsListComponent implements OnInit {
  private gs = inject(GeneralService);
  private afs = inject(Firestore);


  expenseCollection: any
  // expenseCollection: AngularFirestoreCollection
  expensesTotal: any

  range = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl()
  });

  ngOnInit() {
    this.gs.title.next('Reports');
    this.range.get('start')?.setValue(new Date(2018,4,1))
    this.range.get('end')?.setValue(new Date(2020,4,1))
  }


  closeRange(event: any) {
    this.gs.querying.next(true)
    console.log('event: ', this.range);
    const { start, end } = this.range.value
    // this.grabExpenses(start, end)
    this.grabEvents(start, end)
  }

  grabExpenses(start:string, end:string) {
    const ref = collection(this.afs, 'expense');
    this.expenseCollection = query(ref, where('date','>=', start),where('date', '<=', end))
    this.expenseCollection.valueChanges()
    .pipe(map(
      (e: IExpense[]) =>
      e.map(x => {
        const date = x.date.toDate();
        const monthYear = `${date.getMonth()}-${date.getFullYear()}`
        // const [ month, year ] = dayjs(date).format('MMMM-YYYY').split('-')
        // const monthYear = `${month}-${year}`
        return { ...x, date, monthYear }
      })
    ))
    .subscribe((result: any) => {
      const monthGrouped = groupBy(result, 'monthYear')
      console.log('monthGrouped: ', monthGrouped);

      // this.expensesTotal = this.transformation(monthGrouped)
    })

  }

  grabEvents(start: any, end: any) {
    const ref = collection(this.afs, 'events')
    const eventCol = query(ref,
      where('date','>=', start),
      where('date', '<=', end)
    )

    collectionData(eventCol)
    .pipe(
      mergeAll(),
      pluck('events'),
      // map((e: IEventMonth) => e.events),
      // mergeMap((x: IEvent[]) => {

      //   map(this.calculateEventTotal)

      //   // concatMap(this.calculateEventTotal)
      //  debugger
      //  return x
      // })
    )
    .subscribe(resp => {
      this.gs.querying.next(false)
      console.log('resp: ', resp);
    })

    collectionData(eventCol)
    // .pipe(
    //   mergeAll(),
    //   map((e: IEventMonth) => e.events),
    //   mergeMap(x => {
    //    debugger
    //    return x
    //   })
    // )
    .subscribe(resp => {
      this.gs.querying.next(false)
      console.log('Without Merge are below: ', resp);
    })
  }

  calculateEventTotal (x: IEvent) {
    // return collection(x.subCollectionRef).valueChanges()
    // return collection(x.subCollectionRef).valueChanges()
  }

  // transformation(grouped: {string: IExpense[]}) {
  //   const withTotal = {}
  //   for (const [key, value] of Object.entries(grouped)) {
  //     withTotal[key] = this.reduceSum(value)
  //   }
  //   return withTotal
  // }

  // reduceSum (month) {
  //   return month.reduce((acc, next) => {
  //     return acc + Number(next.price)
  //   }, 0)
  // }

}
