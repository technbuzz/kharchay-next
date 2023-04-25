import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Settings {
  breadcrumbs: boolean
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private _settings = new BehaviorSubject<Settings>({breadcrumbs: true})
  settings$ = this._settings.asObservable()

  constructor() { }

  save(value: Settings) {
    this._settings.next(value)
  }
}
