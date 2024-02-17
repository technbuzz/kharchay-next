import { Routes } from "@angular/router";
import { ReportsListComponent } from "./reports-list/reports-list.component";

export const routes:Routes = [
  {
    path: '',
    component: ReportsListComponent,
    data: {
      title: 'Reports List'
    }
  }
];
