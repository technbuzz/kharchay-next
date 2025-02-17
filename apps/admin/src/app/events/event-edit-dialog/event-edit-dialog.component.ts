import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'kha-event-edit-dialog',
    templateUrl: './event-edit-dialog.component.html',
    styleUrls: ['./event-edit-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogTitle, ReactiveFormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule]
})
export class EventEditDialogComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private dialogRef = inject<MatDialogRef<EventEditDialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);

  form!: UntypedFormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      name: ['']
    })
  }

  upsertEvent({ value }:any){
    this.dialogRef.close(value)
  }


  close() {
    this.dialogRef.close({})
  }
}
