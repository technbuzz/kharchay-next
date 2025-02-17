import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedCatComponent } from '../../components/shared-cat/shared-cat.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'kha-edit-dialog',
    templateUrl: './edit-dialog.component.html',
    styleUrls: ['./edit-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, SharedCatComponent, MatSlideToggleModule, MatDialogActions, MatButtonModule, MatDialogClose]
})
export class EditDialogComponent implements OnInit {

  loading = false
  protected test = true

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
      fixed: [fixed || false],
      active: [false],
      disabled: []
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
