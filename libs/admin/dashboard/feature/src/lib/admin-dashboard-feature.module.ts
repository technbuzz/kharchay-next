import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { adminDashboardFeatureRoutes } from './lib.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminDashboardFeatureRoutes),
    RouterModule.forChild(adminDashboardFeatureRoutes),
  ],
})
export class AdminDashboardFeatureModule {}
