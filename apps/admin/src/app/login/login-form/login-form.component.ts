import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from '../../shared/general.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { DatabaseAdapter } from '@data-access';

@Component({
    selector: 'kha-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class LoginFormComponent {

  loading = false

  form: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private fbAuth: Auth,
    private router: Router,
    private dbAdapter: DatabaseAdapter,
    private general: GeneralService) {
    this.form = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  async doLogin(form: UntypedFormGroup) {
    this.loading = true;
    try {
      const result = await this.dbAdapter.signIn(form.value);
      // this.general.setAdmin(result)
      this.router.navigate(['/home'])
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

}
