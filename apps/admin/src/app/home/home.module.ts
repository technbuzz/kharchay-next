import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list'
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { DatabaseAdapter } from 'libs/common/data-adapters/src/lib/database.adapter';
import { FirebaseAdapterService } from '@kh/common/data-adapters';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatProgressBarModule,
    MatListModule,
    BreadcrumbsComponent
  ]
})
export class HomeModule { }
