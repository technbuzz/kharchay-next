import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseItemComponent } from './expense-item/expense-item';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ExpenseItemComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ExpenseItemComponent]
})
export class ComponentsModule { }
