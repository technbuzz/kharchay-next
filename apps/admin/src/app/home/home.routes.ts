import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TitleResolver } from '../shared/title.resolver';

export const homeRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: { title: TitleResolver },
    data: { title: 'Home' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/lib.routes').then(m => m.adminDashboardFeatureRoutes)
      },
      {
        path: 'recurring',
        loadChildren: () => import('../recurring/recurring.routes').then(m => m.routes),
      },
      {
        path: 'events',
        loadChildren: () => import('../events/events.routes').then(m => m.routes)
      },
      {
        path: 'reports',
        loadChildren: () => import('../reports/reporting.routes').then(m => m.routes)
      },
      {
        path: 'settings',
        //loadChildren: () => import('@kh/admin/settings/feature').then(m => m.featureRoutes)
      }
    ]
  }
];
