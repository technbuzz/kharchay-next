import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list'
import { MatLegacyListModule } from "@angular/material/legacy-list";
import { BreadcrumbsComponent } from './breadcrumbs.component';



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
    MatLegacyListModule,
    // MatListModule
  ]
})
export class HomeModule { }
