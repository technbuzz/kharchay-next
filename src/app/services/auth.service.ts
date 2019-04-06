import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  signInWithEmail(cradentials:{email:string;password:string}){
    console.log('Sign in with email');
    return this.afAuth.auth.signInWithEmailAndPassword(cradentials.email, cradentials.password);
  }

  logout(){
    return this.afAuth.auth.signOut()
  }
}
