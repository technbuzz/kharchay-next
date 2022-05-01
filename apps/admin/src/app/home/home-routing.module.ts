import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TitleResolver } from '../shared/title.resolver';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: { title: TitleResolver },
    data: { title: 'Home' },
    children: [
      {
        path: 'recurring',
        loadChildren: () => import('../recurring/recurring.module').then(m => m.RecurringModule),
      },
      {
        path: 'events',
        loadChildren: () => import('../events/events.module').then(m => m.EventsModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
