import { Component, OnInit } from '@angular/core';

import { Settings, SettingsService } from "@kh/admin/settings/data-access";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'kh-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatListModule,
        MatSlideToggleModule,
        MatButtonModule,
    ],
})
export class SettingsComponent implements OnInit {

  form!: FormGroup;

  constructor(private fb: FormBuilder, private service: SettingsService) { }

  ngOnInit(): void {
    this.form = this.fb.group<Settings>({
      breadcrumbs: true
    })

    this.service.settings$.pipe(take(1)).subscribe(resp => {
      this.form.setValue(resp)
    })
  }

  save() {
    this.service.save(this.form.value)
  }



}

