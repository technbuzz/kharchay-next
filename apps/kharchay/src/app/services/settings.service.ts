import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

interface ISettings {
  dynamicPricing: boolean
  collapseEntry: boolean
  deleteRights: boolean
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private key = 'kharchay-configs'



  private inputBS = new BehaviorSubject<ISettings>({
    dynamicPricing: false,
    collapseEntry: false,
    deleteRights: false
  })
  inputBS$ = this.inputBS.asObservable()
  private config!: ISettings

  constructor() {
    this.initConfig()
    console.log('SettingService: Constructor Called')
  }

  private initConfig() {
    this.config = JSON.parse(localStorage.getItem(this.key) as string)

    if (this.config) {
      this.inputBS.next(this.config)
      // this.config.dynamicPricing ? this.inputBS.next(this.config.dynamicPricing) : this.inputBS.next(false)
      // this.config.collapseEntry ? this.inputBS.next(this.config.collapseEntry) : this.inputBS.next(false)
    }
  }

  getConfig(): Observable<ISettings> {
    return this.inputBS.asObservable()
  }

  updateConfig(value: Partial<ISettings>) {
    this.inputBS.next({ ...this.config, ...value })
  }

  setConfig(newConfig:any) {
    this.config = { ...this.config, ...newConfig }
    localStorage.setItem(this.key, JSON.stringify(this.config))
  }
}
