import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
  { path: 'new', loadChildren: () => import('@kh/mobile/create/feature').then(m => m.MobileCreateFeatureModule) },
  { path: 'details', loadChildren: () => import('./details/details.module').then(m => m.DetailsPageModule) },
  { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule) },
  { path: 'filter', loadComponent: () => import('./filter/filter.page').then(m => m.FilterPage) },
  { path: 'summary', loadComponent: () => import('./summary/summary.page').then(m => m.SummaryPage) },
  { path: 'settings', loadComponent: () => import('./settings/settings.page').then(m => m.SettingsPage) },
];

@NgModule({
  imports: [

    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
