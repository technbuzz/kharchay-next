import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { EventsRoutingModule } from './events-routing.module';
import { EventsMainComponent } from './events-main/events-main.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatGridListModule } from "@angular/material/grid-list";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventEditDialogComponent } from './event-edit-dialog/event-edit-dialog.component';
import { EventExpenseListComponent } from './event-expense-list/event-expense-list.component';
import { EventsAllComponent } from './events-all/events-all.component';
import { EventsDateComponent } from './events-date/events-date.component';
import { ExpenseDialogComponent } from './expense-dialog/expense-dialog.component';


import { StorageModule } from "@angular/fire/storage";



@NgModule({
    imports: [
    CommonModule,
    EventsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatTreeModule,
    StorageModule,
    EventsMainComponent, EventEditDialogComponent, EventExpenseListComponent, EventsAllComponent, EventsDateComponent, ExpenseDialogComponent
],
    providers: [MatDatepickerModule]
})
export class EventsModule { }
