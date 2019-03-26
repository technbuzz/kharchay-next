import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],

})
export class SettingsPage implements OnInit {

  dynamicPricing: boolean = false

  constructor(private settingsService: SettingsService, private events: Events) { }

  ngOnInit() {
    this.settingsService.getConfig().subscribe(resp => {
      this.dynamicPricing = resp;
    })
  }

  updateTextMode(event){
    this.settingsService.inputBS.next(this.dynamicPricing);

    // FIXME: Can't we stop using event here but Subjects only
    this.events.publish('dynamic:Pricing', this.dynamicPricing);
    // update localstorage
    this.settingsService.setConfig({dynamicPricing: this.dynamicPricing});

  }

}
