import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Storage } from "@angular/fire/storage";
import { ActivatedRoute } from "@angular/router";

import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IEvent } from '../../shared/event.interface';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { IExpense } from '@models';

@Component({
    selector: 'kha-event-expense-list',
    templateUrl: './event-expense-list.component.html',
    styleUrls: ['./event-expense-list.component.scss'],
    standalone: true,
    imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe]
})
export class EventExpenseListComponent implements OnInit {
  displayedColumns: string[] = ['date', 'note', 'price', 'delete'];
  dataSource!: Observable<IExpense[]>;

  expCollRef:any;
  selectedFile: any;
  month!: Date;

  constructor(
    public dialog: MatDialog,
    private afs: Firestore,
    private storage: Storage,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(map(_ => window.history.state))
    .subscribe((resp:IEvent) => {
      this.expCollRef = collectionData(collection(this.afs, resp.subCollectionRef))
      this.month = resp.month
      this.dataSource = this.getList();
    })
  }

  getList() {
    return this.expCollRef
    // return this.expCollRef.valueChanges().pipe(map(array => {
    //   return array.map((item:any) => {
    //     return {
    //       ...item,
    //       date: item.date.toDate()
    //     }
    //   })
    // }))
  }

  createExpense (expense: any) {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '400px',
      disableClose: true,
      data:{...expense, month: this.month}
    })

    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      this.addExpense(data)
    })
  }

  addExpense(expense: IExpense){
    if (!expense) return
    // const expenseInstance = new Expense(expense.price, expense.note, '', expense.category, expense.date,
    //   expense.subCategory, expense.fixed
    // )
    // FIXME: fix for new api
    // this.expCollRef.add(JSON.parse(JSON.stringify(expenseInstance)))
    // .then(async resp => {
    //   // const imageUrl = await this.uploadFile(resp.id, this.selectedFile)

    //   this.expCollRef.doc(resp.id).update({
    //     id: resp.id,
    //     imageUrl: null
    //   })
    // }).catch(error => {
    //   console.log(error);
    // })
  }

  async uploadFile(id: any, file:any): Promise<any> {
    // FIXME: FIX FOR API UPDATED
    // if(file && file.length) {
    //   try {
    //     // await this.presentLoading();
    //     const task = await this.storage.ref('images').child(id).put(file[0])
    //     // this.loading.dismiss();
    //     return this.storage.ref(`images/${id}`).getDownloadURL().toPromise();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  }

  remove(item: any){
    if(confirm('Do you want to delete?')) {
      if(item.imageUrl) {
        //FIXME: FIX FOR API UPDATED
        // this.storage.ref(`images/${item.id}`).delete()
      }
      this.expCollRef.doc(item.id).delete()
    }
  }

}
