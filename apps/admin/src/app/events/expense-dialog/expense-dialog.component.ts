import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import dayjs from 'dayjs'
import { MatButtonModule } from '@angular/material/button';
import { SharedCatComponent } from '../../components/shared-cat/shared-cat.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'kha-expense-dialog',
    templateUrl: './expense-dialog.component.html',
    styleUrls: ['./expense-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogTitle, ReactiveFormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDatepickerModule, SharedCatComponent, MatDialogActions, MatButtonModule]
})
export class ExpenseDialogComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private dialogRef = inject<MatDialogRef<ExpenseDialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);


  form!: UntypedFormGroup;
  min!: Date;
  max!: Date;

  ngOnInit() {
    const date = new Date(this.data.month.seconds * 1000)
    this.min = dayjs(date).startOf('month').toDate()
    this.max = dayjs(date).endOf('month').toDate()

    const { note, price, fixed, category } = this.data;
    this.form = this.fb.group({
      price: ['', Validators.required],
      date: ['', Validators.required],
      categoryDetails: this.fb.group({
        category: [category],
        subCategory: [category && category.subCategory || ''],
      }),
      imageName: [''],
      note: ['']
    })
  }



  upsertEvent({ value }: any){
    const { categoryDetails: {category, subCategory}, ...rest  } = value
    this.dialogRef.close({category, subCategory, ...rest});
  }


  close() {
    this.dialogRef.close()
  }

}
