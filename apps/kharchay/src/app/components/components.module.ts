import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseItemComponent } from './expense-item/expense-item';
import { IonicModule } from '@ionic/angular';
import { RecurringComponent } from './recurring/recurring.component';
import { FormsModule } from '@angular/forms';
import { NewComponent } from '@kh/mobile/shared/ui/new';
import { SharedUiNewModule } from '@kh/mobile/shared/ui/new';


@NgModule({
    declarations: [ExpenseItemComponent, RecurringComponent],
    imports: [
        CommonModule,
        IonicModule,
        SharedUiNewModule
    ],
    exports: [ExpenseItemComponent, RecurringComponent]
})
export class ComponentsModule { }
