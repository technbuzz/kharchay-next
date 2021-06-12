import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseItemComponent } from './expense-item/expense-item';
import { IonicModule } from '@ionic/angular';
import { ExpenseImageComponent } from './expense-image/expense-image';
import { PieComponent } from './pie/pie';
import { ChartsModule } from 'ng2-charts';
import { RecurringComponent } from './recurring/recurring.component';


@NgModule({
  declarations: [ExpenseItemComponent, ExpenseImageComponent, PieComponent, RecurringComponent],
  imports: [
    CommonModule,
    IonicModule,
    ChartsModule
  ],
  exports: [ExpenseItemComponent, ExpenseImageComponent, PieComponent, RecurringComponent],
  entryComponents: [PieComponent]
})
export class ComponentsModule { }
