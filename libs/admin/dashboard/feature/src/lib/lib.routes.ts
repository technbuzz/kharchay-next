import { Route } from '@angular/router';
import { DashboardShellComponent } from './dashboard-shell.component';

export const adminDashboardFeatureRoutes: Route[] = [
  {
    path: '',
    component: DashboardShellComponent
  },
  /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */
];
