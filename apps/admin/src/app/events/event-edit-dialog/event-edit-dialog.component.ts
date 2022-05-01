import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'kha-event-edit-dialog',
  templateUrl: './event-edit-dialog.component.html',
  styleUrls: ['./event-edit-dialog.component.scss']
})
export class EventEditDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

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
