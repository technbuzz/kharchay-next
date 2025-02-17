import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { filterCircle, home, library, search, statsChart } from 'ionicons/icons';
import { StreamDirective } from './shared/stream.directive';

@Component({
  selector: 'kh-tabs',
  standalone: true,
  imports: [ IonTabs, StreamDirective, RouterLink, IonTabBar, IonTabButton, IonIcon ],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" app-stream>
          <ion-icon name="home"></ion-icon>
        </ion-tab-button>
        <ion-tab-button tab="stats" [routerLink]="['/tabs/stats']" [queryParams]="{period: 'week'}" >
          <ion-icon name="stats-chart"></ion-icon>
        </ion-tab-button>
        <ion-tab-button tab="filter">
          <ion-icon name="filter-circle"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: ``
})
export class TabsComponent {

  constructor() {
    addIcons({ home, statsChart, filterCircle, library, search })
  }
}
