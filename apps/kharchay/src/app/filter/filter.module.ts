import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FilterPage } from './filter.page';
import { ComponentsModule } from '../components/components.module';
import { ExpenseItemComponent } from '../components/expense-item/expense-item';

const routes: Routes = [
  {
    path: '',
    component: FilterPage
  },
  {
    path: ':id',
    component: FilterPage
  },
];

@NgModule({
    imports: [
        ComponentsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        ExpenseItemComponent,
        RouterModule.forChild(routes),
        FilterPage
    ]
})
export class FilterPageModule {}
