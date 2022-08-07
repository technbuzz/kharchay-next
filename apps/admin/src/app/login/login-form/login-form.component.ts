import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from '../../shared/general.service';

@Component({
  selector: 'kha-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  loading = false

  form: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder, 
    private fbAuth: Auth, 
    private router: Router,
    private general: GeneralService) {
    this.form = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  async doLogin(form: UntypedFormGroup) {
    this.loading = true;
    try {
      const result = await signInWithEmailAndPassword(this.fbAuth, form.value.email, form.value.password);
      // this.general.setAdmin(result)
      // debugger
      this.router.navigate(['/home'])
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

}
