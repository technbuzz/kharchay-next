// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
//
// @Injectable({providedIn: 'root'})
export abstract class DatabaseAdapter {
 
  abstract signIn(data: {email: string, password: string}): Promise<void>
}
