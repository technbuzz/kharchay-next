import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
  { path: 'stats', loadComponent: () => import('./stats/stats.component').then(m => m.StatsComponent) },
  {
    path: 'tabs', loadComponent: () => import('./tabs.component').then(m => m.TabsComponent), children: [
      { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
      { path: 'stats', loadComponent: () => import('./stats/stats.component').then(m => m.StatsComponent) },
      { path: 'filter', loadComponent: () => import('./filter/filter.page').then(m => m.FilterPage) },
    ]
  },
  { path: 'new', loadComponent: () => import('@kh/mobile/create/feature').then(m => m.CreateComponent) },
  { path: 'details', loadComponent: () => import('./details/details.page').then(m => m.DetailsPage) },
  { path: 'search', loadComponent: () => import('./search/search.page').then(m => m.SearchPage) },
  { path: 'filter', loadComponent: () => import('./filter/filter.page').then(m => m.FilterPage) },
  { path: 'summary', loadComponent: () => import('./summary/summary.page').then(m => m.SummaryPage) },
  { path: 'settings', loadComponent: () => import('./settings/settings.page').then(m => m.SettingsPage) },
];
