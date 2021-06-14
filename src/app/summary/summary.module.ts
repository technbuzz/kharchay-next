import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SummaryPage } from './summary.page';
import { PieComponent } from './pie/pie';

const routes: Routes = [
  {
    path: '',
    component: SummaryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SummaryPage, PieComponent],
})
export class SummaryPageModule {}
