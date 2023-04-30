// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
//

import { Observable } from "rxjs";

// @Injectable({providedIn: 'root'})
export abstract class DatabaseAdapter {

  abstract signIn(data: {email: string, password: string}): Promise<void>

  abstract signOut(): Promise<void>

  abstract getRecurring(collectionName: string): Observable<[]>

  abstract updateDoc(collectionName:string, id: string, body: any): Promise<void>

}
