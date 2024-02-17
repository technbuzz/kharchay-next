import { Routes } from "@angular/router";
import { RecurringListComponent } from "./recurring-list/recurring-list.component";
import { TaskListComponent } from "./task-list/task-list.component";

export const routes: Routes = [
  {
    path: '',
    component: RecurringListComponent,
    data: {
      title: 'Recurring Tasks'
    }
  },
  {
    path: 'tasks',
    component: TaskListComponent,
    data: {
      title: 'Recurring Tasks'
    }
  }
];
