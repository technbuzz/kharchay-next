import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseAdapter } from './database.adapter';
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { from, Observable, of } from 'rxjs';
import { environment } from '@kh/common/environments';


@Injectable({providedIn: 'root'})
export class SupabaseAdapterService implements DatabaseAdapter {
  #supabase!: SupabaseClient;

  constructor(private http: HttpClient) { 
    this.#supabase = createClient(environment.supabase.url, environment.supabase.key)
  }

  signIn(data: { email: string; password: string; }): Promise<any> {
    return this.#supabase.auth.signInWithPassword(data)
  }

  signOut(): Promise<any> {
    return this.#supabase.auth.signOut()
  }
 
  getRecurring(collectionName: string): Observable<[]> {
  

    // this.#getRecurringPromise(collectionName).then(resp => console.log(resp))
    return from(this.#getRecurringPromise(collectionName))
    
  }

  async #getRecurringPromise(collectionName: string): Promise<any> {
    const { data: { data2}, error: {erro2} } = await this.#supabase.functions.invoke('hello', {
      body: {
        name: 'Sami'
      }
    })
    console.log('function ran', data2)
    const { data, error } = await this.#supabase.from(collectionName).select()
    return data
  }
}
