import { Observable } from 'rxjs';
import { EventService } from '../../shared/events.service';
import { NavigationExtras, Router } from '@angular/router';
import { collectionData, Firestore } from '@angular/fire/firestore';

import dayjs from "dayjs";
import { MatDialog } from '@angular/material/dialog';
import { EventEditDialogComponent } from '../event-edit-dialog/event-edit-dialog.component';
import { Component, OnInit, inject } from '@angular/core';
import { IEventMonth } from "../../shared/eventMonth.interface";
import { IEvent } from '../../shared/event.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'kha-events-date',
    templateUrl: './events-date.component.html',
    styleUrls: ['./events-date.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, NgIf, MatButtonModule, MatIconModule, MatTableModule]
})
export class EventsDateComponent implements OnInit {
  es = inject(EventService);
  dialog = inject(MatDialog);
  private afs = inject(Firestore);
  private router = inject(Router);


  dataSource!: Observable<any>;
  displayedColumns: string[] = ['name', 'edit', 'delete'];
  selectedMonth!: Date
  start: any
  end: any
  events: {status: 'initial'|'empty'|'loaded', data: IEvent[]} = {
    status: 'initial',
    data: []
  }
  emptyEventMonth!: boolean
  testRef: any;
  first!: IEventMonth;

  ngOnInit() {
    // this.fireFunctions.functions.useFunctionsEmulator('http://localhost:5000')
  }

  searchEvents({ value }: any) {
    this.start = dayjs(value).startOf('month').toDate()
    this.end = dayjs(value).endOf('month').toDate()

    console.log({
      start: this.start,
      end: this.end
    })


    collectionData(this.es.searchAndRetriveEventByMonth(this.start, this.end)).subscribe((eventMonth: any) => {
      console.log('eventMonth: ', eventMonth)
      if (eventMonth.length) {
        this.first = eventMonth[0]
        this.emptyEventMonth = false

        this.events.data = this.first.events

        if (this.first.events.length) {
          this.events.status = 'loaded'
        } else {
          this.events.status = 'empty'
        }

      } else {
        this.emptyEventMonth = true
        this.events.status = 'initial'
        this.events.data = []
      }
    })
  }

  newMonthCollection() {
    const monthYear = dayjs(this.selectedMonth).format('M-YYYY')
    // FIXME: FIX FOR API UPDATE
    // this.es.addNewCollectionMonthRoot(monthYear, this.selectedMonth).then(resp => {
    //   console.log('New MOnth collection created', resp);
    // });
  }

  async createEvent(event: any) {
    const dialogRef = this.dialog.open(EventEditDialogComponent, {
      width: '400px',
      disableClose: true
    })

    // FIXME: FIX FOR API UPDATE
    // dialogRef.afterClosed().subscribe(resp => {
    //   console.log('resp: ', resp);
    //   if (resp.name) {
    //     const funcRef = this.es.createEventList(this.first, resp.name)
    //     funcRef.execute.subscribe(resp => {
    //       this.es.addSubCollection(funcRef.data.subCollectionRef)
    //     }, error => {
    //         console.log(error)
    //     })
    //   }

    // })
  }

  removeEventListHander(event: any) {
    // FIXME: FIX FOR API UPDATE
    // this.es.removeEventList(this.first, event)

  }

  navigateToEventsListing(item: IEvent) {
    const extras: NavigationExtras = {

      state: {
        title: item.title,
        month: item.month,
        subCollectionRef: item.subCollectionRef
      },
    }
    this.router.navigate(['home/events/date', item.id], extras)
  }

  testCallable(){
    // const fn = this.fireFunctions.functions.httpsCallable('helloWorldCallable')
    // fn().then(resp => {
    //   console.log(resp);
    // }).catch(error => console.log(error))
  }

}

