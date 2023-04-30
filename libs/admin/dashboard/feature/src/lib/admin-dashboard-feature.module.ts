import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { adminDashboardFeatureRoutes } from './lib.routes';
import { DashboardShellComponent } from './dashboard-shell.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminDashboardFeatureRoutes),
    RouterModule.forChild(adminDashboardFeatureRoutes),
  ],
  declarations: [DashboardShellComponent],
})
export class AdminDashboardFeatureModule {}
