import { Component, OnInit } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralService } from '../../shared/general.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

export interface Task {
  id ?: string;
  fixed: boolean;
  note: string;
  price: number;
}

@Component({
  selector: 'kha-recurring-list',
  templateUrl: './recurring-list.component.html',
  styleUrls: ['./recurring-list.component.scss']
})
export class RecurringListComponent implements OnInit {

  displayedColumns: string[] = ['note', 'price', 'fixed', 'edit'];
  dataSource!: Observable<any>; 

  recurringColl = collection(this.afs, 'recurring')

  constructor(
    private afs: Firestore,
    public dialog: MatDialog,
    public gs: GeneralService
  ) { }

  ngOnInit() {
    this.gs.title.next('Recurring');
    setTimeout(() => {
      
      this.dataSource = this.checkRecurring();
    }, 1000);
    // this.checkRecurring()
  }

  checkRecurring() {
    return collectionData(this.recurringColl).pipe(map((array: any) => {
      return array.map((item:any) => {
        return {
          ...item,
          date: item.date.toDate()
        }
      })
    }))
    // .subscribe(resp => {
    //   console.log(resp)
    // })
  }

  presentEditModal(item: Task|any){
    const dialogRef= this.dialog.open(EditDialogComponent, {
      width: '400px',
      disableClose: true,
      data: item
    })

    dialogRef.afterClosed().subscribe(async result => {
      console.log(result);
      if(result) {
        // FIXME: Update teh firestore api 
        // update logic goes here
        // try {
        //   if(item.id){
        //     await this.afs.collection('recurring').doc(item.id).update(result)
        //   } else {
        //     const newTask:DocumentReference = await this.afs.collection('recurring').add(result)
        //     const id = newTask.id;
        //     await newTask.update({
        //       id
        //     });
        //   }
          
        // } catch (error) {
        //   console.log(error);
          
        // }
      }
    })
  }

}
