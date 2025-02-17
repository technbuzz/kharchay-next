import { Injectable } from '@angular/core';
// import * as firebase from "firebase";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  public title = new BehaviorSubject('Home');
  public querying = new BehaviorSubject(false);

  constructor() { }



  // setAdmin(data) {
  //   const adminFn = firebase.functions().httpsCallable('addAdmin');
  //   debugger
  //   adminFn(data)
  //     .then(function(result) {
  //       console.log('Delete success: ' + JSON.stringify(result));
  //     })
  //     .catch(function(err) {
  //       console.log('Delete failed, see console,');
  //       console.warn(err);
  //     });
  // }
}
