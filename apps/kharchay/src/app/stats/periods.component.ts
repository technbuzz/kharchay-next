import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { StatsService } from './stats.service';

@Component({
  selector: 'kh-periods',
  standalone: true,
  imports: [IonButton],
  template: `
    <ion-button [fill]="$queries()?.period === 'week' ? 'outline' : 'clear'" (click)="changePeriod('week')" size="small" >Week</ion-button>
    <ion-button [fill]="$queries()?.period === 'month' ? 'outline' : 'clear'" (click)="changePeriod('month')" size="small" >Month</ion-button>
  `,
  styles: ``
})
export class PeriodsComponent {
  #service = inject(StatsService);
  $queries = this.#service.$queries;

  changePeriod(period: string) {
    this.#service.setQueries({ period })
  }
}
