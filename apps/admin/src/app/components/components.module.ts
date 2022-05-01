import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCatComponent } from './shared-cat/shared-cat.component';

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SharedCatComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  exports: [SharedCatComponent]
})
export class ComponentsModule { }
