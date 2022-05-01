import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState } from "@angular/fire/auth";
import { traceUntilFirst } from '@angular/fire/performance';
import { map } from 'rxjs/operators';


@Component({
  selector: 'kha-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(router: Router, auth: Auth) {
    auth.currentUser

    authState(auth).pipe(
      traceUntilFirst('auth'),
      map(u => !!u)
    ).subscribe(resp => {
      if(resp){
        router.navigate(['/home/reports'])
      } else {
        router.navigate(['/login'])
      }
    })
  }
}
