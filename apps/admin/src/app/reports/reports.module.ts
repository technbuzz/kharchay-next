import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatNativeDateModule} from '@angular/material/core';


import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ReportsListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
    ReportsRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule
  ]
})
export class ReportsModule { }
