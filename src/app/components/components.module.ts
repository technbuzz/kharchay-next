import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseItemComponent } from './expense-item/expense-item';
import { IonicModule } from '@ionic/angular';
import { ExpenseImageComponent } from './expense-image/expense-image';

@NgModule({
  declarations: [ExpenseItemComponent,ExpenseImageComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ExpenseItemComponent,ExpenseImageComponent]
})
export class ComponentsModule { }
