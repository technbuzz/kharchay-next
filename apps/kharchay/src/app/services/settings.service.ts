import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

interface ISettings {
  dynamicPricing: boolean
  collapseEntry: boolean
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private key = 'kharchay-configs'



  private inputBS = new BehaviorSubject(false)
  inputBS$ = this.inputBS.asObservable()
  private config!: ISettings

  constructor() {
    this.initConfig()
    console.log('SettingService: Constructor Called')
  }

  private initConfig() {
    this.config = JSON.parse(localStorage.getItem(this.key) as string)

    if (this.config) {
      this.config.dynamicPricing ? this.inputBS.next(this.config.dynamicPricing) : this.inputBS.next(false)
    }
  }

  getConfig(): Observable<boolean> {
    return this.inputBS.asObservable()
  }

  updateConfig(value:boolean) {
    this.inputBS.next(value)
  }

  setConfig(newConfig:any) {
    this.config = { ...this.config, ...newConfig }
    localStorage.setItem(this.key, JSON.stringify(this.config))
  }
}
