import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventService } from '../../shared/events.service';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { collectionData, Firestore } from '@angular/fire/firestore';

import dayjs from "dayjs";
import { MatDialog } from '@angular/material/dialog';
import { EventEditDialogComponent } from '../event-edit-dialog/event-edit-dialog.component';
import { TitleResolver } from '../../shared/title.resolver';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

interface IEventArray {
  title: string,
  id: string,
  subCollectionRef: string
}

interface IEventMonth {
  name: string,
  id: string,
  date: Date,
  events: IEventArray[]
}

@Component({
    selector: 'kha-events-main',
    templateUrl: './events-main.component.html',
    styleUrls: ['./events-main.component.scss'],
    standalone: true,
    imports: [MatGridListModule, MatButtonModule, RouterLink]
})
export class EventsMainComponent implements OnInit {

  dataSource!: Observable<any>;
  displayedColumns: string[] = ['title', 'edit', 'delete'];
  selectedMonth!: Date
  start: any
  end: any
  events: {status: 'initial'|'empty'|'loaded', data: IEventArray[]} = {
    status: 'initial',
    data: []
  }
  emptyEventMonth!: boolean
  testRef: any;
  first!: IEventMonth;

  constructor(
    public es: EventService,
    public dialog: MatDialog,
    private afs: Firestore,
    private router: Router ) { }

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


    collectionData(this.es.searchAndRetriveEventByMonth(this.start, this.end))
    .subscribe((eventMonth: any) => {
    // .subscribe((eventMonth: IEventMonth[]) => {
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
//FIXME: disabled below code of need update to new api
    // this.es.addNewCollectionMonthRoot(monthYear, this.selectedMonth).then(resp => {
    //   console.log('New MOnth collection created', resp);
    // });
  }

  async createEvent() {
    const dialogRef = this.dialog.open(EventEditDialogComponent, {
      width: '400px',
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(resp => {
      console.log('resp: ', resp);
      if (resp.title) {
//FIXME: disabled below code of need update to new api
        // const funcRef = this.es.createEventList(this.first, resp.title)
        // funcRef.execute.subscribe(resp => {
        //   console.log('funcRef: ', funcRef.data)

        //   this.es.addSubCollection(funcRef.data.subCollectionRef)
        //   console.log(resp)
        // }, error => {
        //     console.log(error)
        //   //   // this.presentToast()
        // })
      }

    })
  }

  removeEventListHander(event: any) {
//FIXME: disabled below code of need update to new api
    // this.es.removeEventList(this.first, event)

  }

  navigateToEventsListing(item: IEventArray) {
    const extras: NavigationExtras = {
      queryParams: {
        title: item.title,
        subCollectionRef: item.subCollectionRef
      }
    }
    this.router.navigate(['eventsList/'], extras)
  }

  testCallable(){
    // const fn = this.fireFunctions.functions.httpsCallable('helloWorldCallable')
    // fn().then(resp => {
    //   console.log(resp);
    // }).catch(error => console.log(error))
  }

}
