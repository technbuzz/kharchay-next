import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RecurringComponent } from './recurring/recurring.component';
import { FormsModule } from '@angular/forms';
import { NewComponent } from '@kh/mobile/shared/ui/new';
import { SharedUiNewModule } from '@kh/mobile/shared/ui/new';


@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        SharedUiNewModule,
        RecurringComponent
    ],
    exports: [RecurringComponent]
})
export class ComponentsModule { }
