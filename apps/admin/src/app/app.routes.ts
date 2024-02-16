import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app.component').then(m => m.AppComponent),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login-form/login-form.component').then(m => m.LoginFormComponent)
  },

  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
