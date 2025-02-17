import {Component, OnInit} from "@angular/core";

import { addDoc, updateDoc, collectionData, Firestore, doc } from '@angular/fire/firestore';
import { collection, deleteDoc } from 'firebase/firestore';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import { GeneralService } from '../../shared/general.service';
import { MatButtonModule } from "@angular/material/button";
import { NgFor, AsyncPipe, DatePipe } from "@angular/common";

export interface Task {
  id : string;
  fixed: boolean;
  note: string;
  price: number;
  active: boolean;
  date: Date;
}

@Component({
    selector: 'kha-task-list',
    templateUrl: './task-list.component.html',
    standalone: true,
    imports: [
        NgFor,
        MatButtonModule,
        AsyncPipe,
        DatePipe,
    ],
})
export class TaskListComponent implements OnInit {

  displayedColumns: string[] = ['note', 'price', 'fixed', 'active', 'edit'];

  taskColl = collection(this.afs, 'tasks')
  tasks$!: Observable<Task[]>;

  constructor(
    private afs: Firestore,
    public gs: GeneralService
  ) { }

  ngOnInit() {
    this.gs.title.next('Recurring');
    this.tasks$ = this.checkRecurring()
  }

  checkRecurring() {
    return collectionData(this.taskColl)
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

  async delete(task: any) {
   try {

    await deleteDoc(doc(this.afs, "tasks", task.id));
   } catch(error) {
     console.log(error)
   } 
  }



}
