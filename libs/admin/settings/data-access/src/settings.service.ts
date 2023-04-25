import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Settings {
  breadcrumbs: boolean
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  #settings = new BehaviorSubject<Settings>({breadcrumbs: true})
  settings$ = this.#settings.asObservable()

  constructor() { }

  save(value: Settings) {
    this.#settings.next(value)
  }
}
