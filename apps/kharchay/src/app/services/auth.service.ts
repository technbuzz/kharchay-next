import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);


  async signInWithEmail(cradentials: {email: string;password: string}){
    console.log('Sign in with email');
    return await signInWithEmailAndPassword(this.auth, cradentials.email, cradentials.password);
  }

  logout(){
    return this.auth.signOut();
  }
}
