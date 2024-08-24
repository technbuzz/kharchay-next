import { AsyncPipe, CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonButton, IonContent, IonIcon, IonList, IonText } from '@ionic/angular/standalone';
import { ActiveElement, BarController, BarElement, CategoryScale, Chart, ChartEvent, LinearScale, TimeScale, Tooltip } from 'chart.js';
import { ExpenseItemComponent } from '../components/expense-item/expense-item';
import { PeriodsComponent } from './periods.component';
import { StatsWeekComponent } from './stats-week/stats-week.component';
import { StatsService } from './stats.service';
import { StatsMonthComponent } from './stats-month/stats-month.component';

Chart.register(BarController, BarElement, Tooltip, CategoryScale, LinearScale, TimeScale);
@Component({
  selector: 'kh-stats',
  standalone: true,
  imports: [IonContent, AsyncPipe, IonIcon, StatsMonthComponent, CurrencyPipe, PeriodsComponent, StatsWeekComponent, ExpenseItemComponent, DatePipe, IonList, JsonPipe, IonText, IonButton],
  templateUrl: './stats.component.html',
})
export class StatsComponent {

  protected service = inject(StatsService);
  $queries = this.service.$queries;

  $total = computed(() => {
    return this.service.$expenses().reduce((a, b: any) => Number(a) + Number(b.price), 0)
  })

  $updatedLabel = computed(() => {
    const days = this.service.$daysInPeriod()
    let labels = days == 7 ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] :
      Array.from({ length: days }, (_, i) => i + 1)
    return labels
  })

  // $updatedConfig = computed(() => {
  //   let { grouped } = this.$expensesSet()
  //   let days = this.service.$daysInPeriod()
  //   let weekStyles = { barThickness: 24, borderWidth: 2, borderRadius: 5, }
  //   let monthStyles = { borderRadius: 5, barThickness: 4, }
  //
  //   let result = days == 7 ? weekStyles : monthStyles
  //   return {
  //     ...result,
  //     data: [...grouped],
  //     backgroundColor: '#191928',
  //   }
  // })

  // expenses$ = this.#service.expenses$.pipe(
  //   tap(() => this.resetChart()),
  //   tap(expenses => this.updateChartData(expenses.grouped)),
  //   tap(() => this.#chart.update())
  // )

  ngOnInit() {
    this.service.getUsers$().subscribe(console.log)
  }

  constructor() {
    // effect(() => {
    //   let labels = this.$updatedLabel()
    //   this.#chart.data.labels = labels;
    //   console.log('label updated', labels)
    // })

    effect(() => {
      //@ts-ignore
      // this.#chart.data.datasets.push(this.$updatedConfig())
      // this.#chart.update()
      // console.log(this.#chart.config)
      // console.log('config updated', this.$updatedConfig())
    })

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
