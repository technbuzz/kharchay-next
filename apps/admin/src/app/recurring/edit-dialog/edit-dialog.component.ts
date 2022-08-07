import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'kha-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  loading = false

  form!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}
  
  ngOnInit() {
    const { note, price, fixed, category } = this.data;
    this.form = this.fb.group({
      note: [note, Validators.required],
      price: [price, Validators.required],
      categoryDetails: this.fb.group({
        category: [category],
        subCategory: [category && category.subCategory || ''],
      }),
      fixed: [fixed || false]
    })
  }


  add(){
    const { categoryDetails: {category, subCategory}, ...rest  } = this.form.value
    this.dialogRef.close({category, subCategory, ...rest, date: new Date()});
  }

  close() {
    this.dialogRef.close();
  }

}
