import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { adminDashboardFeatureRoutes } from './lib.routes';
import { DashboardShellComponent } from './dashboard-shell.component';
import { TransactionsMiniComponent } from './transactions-mini/transactions-mini.component';
import { OverviewMonthMiniComponent } from './overview-month-mini/overview-month-mini.component';

@NgModule({
  imports: [
    CommonModule,
    TransactionsMiniComponent,
    OverviewMonthMiniComponent,
    RouterModule.forChild(adminDashboardFeatureRoutes),
  ],
  declarations: [DashboardShellComponent],
})
export class AdminDashboardFeatureModule {}
