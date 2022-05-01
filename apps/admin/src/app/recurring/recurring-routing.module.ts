import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecurringListComponent } from './recurring-list/recurring-list.component';


const routes: Routes = [
  {
    path: '',
    component: RecurringListComponent,
    data: {
      title: 'Recurring Tasks'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecurringRoutingModule { }
