import { CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonButton, IonContent, IonIcon, IonList, IonText } from '@ionic/angular/standalone';
import { ActiveElement, BarController, BarElement, CategoryScale, Chart, ChartEvent, LinearScale, TimeScale, Tooltip } from 'chart.js';
import { ExpenseItemComponent } from '../components/expense-item/expense-item';
import { PeriodsComponent } from './periods.component';
import { StatsWeekComponent } from './stats-week/stats-week.component';
import { StatsService } from './stats.service';

Chart.register(BarController, BarElement, Tooltip, CategoryScale, LinearScale, TimeScale);
@Component({
  selector: 'kh-stats',
  standalone: true,
  imports: [IonContent, IonIcon, CurrencyPipe, PeriodsComponent, StatsWeekComponent, ExpenseItemComponent, DatePipe, IonList, JsonPipe, IonText, IonButton],
  templateUrl: './stats.component.html',
})
export class StatsComponent {

  chartEl = viewChild.required('container', { read: ElementRef<HTMLCanvasElement> })
  #chart!: Chart;
  protected service = inject(StatsService);
  $queries = this.service.$queries;
  $expensesSet = toSignal(this.service.expenses$, { initialValue: { grouped: [], ungrouped: []} })

  $total = computed(() => {
    return this.service.$expensesRaw().reduce((a, b: any) => Number(a) + Number(b.price), 0)
  })

  $updatedLabel = computed(() => {
    const days = this.service.$daysInPeriod()
    let labels = days == 7 ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] :
      Array.from({ length: days}, (_, i) => i + 1)
    return labels
  })

  $updatedConfig = computed(() => {
    let { grouped } = this.$expensesSet()
    let days = this.service.$daysInPeriod()
    let weekStyles = { barThickness: 24, borderWidth: 2, borderRadius: 5, }
    let monthStyles = { borderRadius: 5, barThickness: 4, }

    let result = days == 7 ? weekStyles : monthStyles
    return {
      ...result,
      data: [...grouped],
      backgroundColor: '#191928',
    }
  })

  // expenses$ = this.#service.expenses$.pipe(
  //   tap(() => this.resetChart()),
  //   tap(expenses => this.updateChartData(expenses.grouped)),
  //   tap(() => this.#chart.update())
  // )


  constructor() {
    effect(() => {
      console.log('total', this.$total())
    })
    // effect(() => {
    //   let labels = this.$updatedLabel()
    //   this.#chart.data.labels = labels;
    //   console.log('label updated', labels)
    // })

    effect(() => {
      this.resetChart()
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


  ngAfterViewInit(): void {

    this.#chart = new Chart(this.chartEl().nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: '# of Votes',
            data: [],
          },
        ],
        // labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        // datasets: [
        //   {
        //     label: '# of Votes',
        //     data: [],
        //   },
        // ],
      },
      options: {
        onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
          console.log(elements.at(0))
          // const canvasPosition = getRelativePosition(e, );
          //
          //   // Substitute the appropriate scale IDs
          // const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
          // const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
          //
        },
        events: ['click'],
        scales: {
          x: {
            border: {
              display: false
            },
            grid: {
              display: false,
              drawTicks: false
            }
          },
          y: {
            position: 'right',
            border: {
              display: false
            },
            grid: {
              display: false
            },
            ticks: {
              stepSize: 50,
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },

        }

      }
    });
  }

  resetChart() {
    // this.#chart.data.labels = []
    this.#chart.data.datasets = []
  }



}
