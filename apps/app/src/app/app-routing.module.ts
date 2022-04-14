import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'details', loadChildren: () => import('./details/details.module').then(m => m.DetailsPageModule) },
  { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule) },
  { path: 'filter', loadChildren: () => import('./filter/filter.module').then(m => m.FilterPageModule) },
  { path: 'summary', loadChildren: () => import('./summary/summary.module').then(m => m.SummaryPageModule) },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
