import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IExpense } from '../../shared/expense.interface';

import * as dayjs from 'dayjs'

@Component({
  selector: 'kha-expense-dialog',
  templateUrl: './expense-dialog.component.html',
  styleUrls: ['./expense-dialog.component.scss']
})
export class ExpenseDialogComponent implements OnInit {

  form!: FormGroup;
  min!: Date;
  max!: Date;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { }

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
