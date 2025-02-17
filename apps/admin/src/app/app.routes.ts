import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app.component').then(m => m.AppComponent),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.routes').then(m => m.homeRoutes)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login-form/login-form.component').then(m => m.LoginFormComponent)
  },

  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
