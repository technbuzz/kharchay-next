import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, JsonPipe } from '@angular/common';
import { Component, computed, inject, InjectionToken, Injector } from '@angular/core';
import { IonButton, IonContent, IonIcon, IonList, IonText } from '@ionic/angular/standalone';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, TimeScale, Tooltip } from 'chart.js';
import { ExpenseItemComponent } from '../components/expense-item/expense-item';
import { PeriodsComponent } from './periods.component';
import { StatsMonthComponent } from './stats-month/stats-month.component';
import { StatsWeekComponent } from './stats-week/stats-week.component';
import { StatsService } from './stats.service';
import { DurationDisplayPipe } from '../shared/pipes/durationPipe';
import { toSignal } from '@angular/core/rxjs-interop';

Chart.register(BarController, BarElement, Tooltip, CategoryScale, LinearScale, TimeScale);
@Component({
  selector: 'kh-stats',
  standalone: true,
  imports: [IonContent, AsyncPipe, DecimalPipe, DurationDisplayPipe, JsonPipe, IonIcon, StatsMonthComponent, CurrencyPipe, PeriodsComponent, StatsWeekComponent, ExpenseItemComponent, DatePipe, IonList, JsonPipe, IonText, IonButton],
  templateUrl: './stats.component.html',
})
export class StatsComponent {

  protected service = inject(StatsService);
  $queries = this.service.$queries;

  injector = inject(Injector)

  $expenses = toSignal(this.service.expenses$(this.injector), { initialValue: [] })

  $total = computed(() => {
    return this.$expenses().reduce((a, b: any) => Number(a) + Number(b.price), 0)
  })

  forward() {
    let timestamp = Number(this.$queries()?.timestamp)
    this.service.setQueries({ timestamp: this.service.addPeriod(timestamp).getTime() })
  }

  backward() {
    let timestamp = Number(this.$queries()?.timestamp)
    this.service.setQueries({ timestamp: this.service.subPeriod(timestamp).getTime() })
  }

}
