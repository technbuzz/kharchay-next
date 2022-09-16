import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';


import { RecurringRoutingModule } from './recurring-routing.module';
import { RecurringListComponent } from './recurring-list/recurring-list.component';
import { FirestoreModule } from '@angular/fire/firestore';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ComponentsModule } from '../components/components.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {TaskListComponent} from './task-list/task-list.component';


@NgModule({
    declarations: [RecurringListComponent, EditDialogComponent, TaskListComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RecurringRoutingModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        FirestoreModule,
        ComponentsModule,
        MatSlideToggleModule
    ]
})
export class RecurringModule { }
