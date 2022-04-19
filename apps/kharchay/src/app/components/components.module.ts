import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseItemComponent } from './expense-item/expense-item';
import { IonicModule } from '@ionic/angular';
import { ExpenseImageComponent } from './expense-image/expense-image';
import { RecurringComponent } from './recurring/recurring.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [ExpenseItemComponent, ExpenseImageComponent, RecurringComponent],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [ExpenseItemComponent, ExpenseImageComponent, RecurringComponent]
})
export class ComponentsModule { }
