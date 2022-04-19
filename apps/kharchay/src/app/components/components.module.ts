import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseItemComponent } from './expense-item/expense-item';
import { IonicModule } from '@ionic/angular';
import { RecurringComponent } from './recurring/recurring.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [ExpenseItemComponent, RecurringComponent],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [ExpenseItemComponent, RecurringComponent]
})
export class ComponentsModule { }
