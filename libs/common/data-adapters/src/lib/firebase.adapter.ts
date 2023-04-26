import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { HttpClient } from '@angular/common/http';
import { DBAdapter } from './adapter.interface';


@Injectable({ providedIn: 'root' })
export class FirebaseAdapterService implements DBAdapter {
  constructor(private http: HttpClient, private fbAuth: Auth) { }

  async signIn(data: {email: string, password: string}) {
    await signInWithEmailAndPassword(this.fbAuth, data.email, data.password);
  }

}