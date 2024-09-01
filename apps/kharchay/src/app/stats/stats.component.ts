import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { IonButton, IonContent, IonIcon, IonList, IonText } from '@ionic/angular/standalone';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, TimeScale, Tooltip } from 'chart.js';
import { ExpenseItemComponent } from '../components/expense-item/expense-item';
import { PeriodsComponent } from './periods.component';
import { StatsMonthComponent } from './stats-month/stats-month.component';
import { StatsWeekComponent } from './stats-week/stats-week.component';
import { StatsService } from './stats.service';

Chart.register(BarController, BarElement, Tooltip, CategoryScale, LinearScale, TimeScale);
@Component({
  selector: 'kh-stats',
  standalone: true,
  imports: [IonContent, AsyncPipe, DecimalPipe, JsonPipe, IonIcon, StatsMonthComponent, CurrencyPipe, PeriodsComponent, StatsWeekComponent, ExpenseItemComponent, DatePipe, IonList, JsonPipe, IonText, IonButton],
  templateUrl: './stats.component.html',
})
export class StatsComponent {

  protected service = inject(StatsService);
  $queries = this.service.$queries;

  $total = computed(() => {
    return this.service.$expenses().reduce((a, b: any) => Number(a) + Number(b.price), 0)
  })

  constructor() {
  }

  forward() {
    let timestamp = Number(this.$queries()?.timestamp)
    this.service.setQueries({ timestamp: this.service.addPeriod(timestamp).getTime() })
  }

  backward() {
    let timestamp = Number(this.$queries()?.timestamp)
    this.service.setQueries({ timestamp: this.service.subPeriod(timestamp).getTime() })
  }

}
