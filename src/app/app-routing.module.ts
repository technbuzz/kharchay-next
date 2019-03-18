import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'details', loadChildren: './details/details.module#DetailsPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'filter', loadChildren: './filter/filter.module#FilterPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
