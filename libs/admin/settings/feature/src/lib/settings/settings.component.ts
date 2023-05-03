import { Component, OnInit } from '@angular/core';

import { Settings, SettingsService } from "@kh/admin/settings/data-access";
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'kh-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
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

