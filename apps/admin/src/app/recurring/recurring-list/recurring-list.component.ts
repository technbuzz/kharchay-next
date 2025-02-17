import { Component, OnInit } from '@angular/core';
import { addDoc, updateDoc, collectionData, Firestore, doc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseAdapter } from '@kh/common/data-adapters';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralService } from '../../shared/general.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

export interface Task {
  id ?: string;
  fixed: boolean;
  note: string;
  price: number;
  enabled: boolean;
}

@Component({
    selector: 'kha-recurring-list',
    templateUrl: './recurring-list.component.html',
    styleUrls: ['./recurring-list.component.scss'],
    standalone: true,
    imports: [MatTableModule, MatSlideToggleModule, MatButtonModule, MatIconModule, RouterLink]
})
export class RecurringListComponent implements OnInit {

  displayedColumns: string[] = ['note', 'price', 'fixed', 'active', 'edit'];
  dataSource!: Observable<any>;

  recurringColl = collection(this.afs, 'recurring')

  constructor(
    private afs: Firestore,
    private dbAdapter: DatabaseAdapter,
    public dialog: MatDialog,
    public gs: GeneralService
  ) { }

  ngOnInit() {
    this.gs.title.next('Recurring');
    // this.dataSource = this.checkRecurring();
    this.dataSource = this.dbAdapter.getRecurring('recurring')
  }

  checkRecurring() {
    return collectionData(this.recurringColl)
    .pipe(
      map((array: any) => {
        return array.map((item:any) => ({
            ...item,
            date: item.date.toDate()
          })
        ) // map
      })// map
    ) // pipe
  }

  presentEditModal(item: Task|any){
    const dialogRef= this.dialog.open(EditDialogComponent, {
      width: '400px',
      minHeight: 400,
      disableClose: true,
      data: item
    })

    console.log(dialogRef.componentInstance)

    dialogRef.afterClosed().subscribe(async result => {
      console.log(result);
      if(result) {
        // FIXME: Update teh firestore api
        // update logic goes here
        try {
          if(item.id){

            // await this.dbAdapter.updateDoc('recurring', item.id, result)
            await updateDoc(doc(this.afs, 'recurring', item.id), result)
            // await this.afs.collection('recurring').doc(item.id).update(result)
          } else {
            // const newTask:DocumentReference = await this.afs.collection('recurring').add(result)
            // const id = newTask.id;
            const task = await addDoc(this.recurringColl, result)

            // await newTask.update({
            //   id: task.id
            // });
          }

        } catch (error) {
          console.log(error);

        }
      }
    })
  }

}
