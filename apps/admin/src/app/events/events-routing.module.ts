import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsMainComponent } from './events-main/events-main.component';
import { EventExpenseListComponent } from './event-expense-list/event-expense-list.component';
import { EventsDateComponent } from './events-date/events-date.component';
import { EventsAllComponent } from './events-all/events-all.component';
import { TitleResolver } from '../shared/title.resolver';


const routes: Routes = [
  {
    path: '',
    data: { title: 'Events' },
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: EventsMainComponent,
        resolve: { title: TitleResolver },
        data: { title: 'Events' }
      },
      {
        path: 'all',
        component: EventsAllComponent,
        resolve: { title: TitleResolver },
        data: { title: 'All Events' }
      },
      {
        path: 'date',
        component: EventsDateComponent,
        resolve: { title: TitleResolver },
        data: { title: 'Events By Month' }
      },
      {
        path: 'date/:id',
        component: EventExpenseListComponent,
        data: {
          title: 'Event Expense List'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
