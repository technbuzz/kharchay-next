import { DatePipe, JsonPipe } from '@angular/common';
import { Component, ElementRef, inject, viewChild, ViewChild } from '@angular/core';
import { IonButton, IonContent, IonText } from '@ionic/angular/standalone';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, LineController, LineElement, Point, TimeScale, Tooltip } from 'chart.js';
import { endOfWeek, startOfWeek } from 'date-fns';
import { PeriodSwipeDirective } from './period-swipe.directive';
import { StatsService } from './stats.service';
import { tap } from 'rxjs';
import { IExpense } from '@kh/common/api-interface';

Chart.register(BarController, BarElement, LineController, LineElement, Tooltip, CategoryScale, LinearScale, TimeScale);
@Component({
  selector: 'kh-stats',
  standalone: true,
  imports: [IonContent, DatePipe, PeriodSwipeDirective, JsonPipe, IonText, IonButton],
  templateUrl: './stats.component.html',
})
export class StatsComponent {

  chartEl = viewChild.required('container', { read: ElementRef<HTMLCanvasElement> })
  chart!: Chart;


  service = inject(StatsService);
  $queries = this.service.$queries;


  expenses$ = this.service.expenses$.pipe(
    tap(() => this.resetChart()),
    tap(expenses => this.updateChartData(expenses)),
    tap(() => this.chart.update())
  )

  changePeriod(period: string) {
    this.service.setQueries({ period })
  }

  onSwipeRight(date: Date) {
    this.service.setQueries({ timestamp: date.getTime() })
  }

  onSwipeLeft(date: Date) {
    this.service.setQueries({ timestamp: date.getTime() })
  }

  updateChartData(expenses: Number[]) {
    console.log(expenses)
    this.chart.data.datasets.push({
    // @ts-ignore
      data: [...expenses],
      backgroundColor: ['tomato', '#FF9020', '#059BFF', 'rebeccapurple', 'gold', '#FF6384', 'indigo', '#FFC234',],
      borderWidth: 2,
      borderRadius: 5,
      barThickness: 24,
    })
  }

  ngAfterViewInit(): void {
    this.expenses$.subscribe()

    this.chart = new Chart(this.chartEl().nativeElement, {
      type: 'bar',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 39, 3, 45, 82, 3, 27],
            backgroundColor: ['tomato', '#FF9020', '#059BFF', 'rebeccapurple', 'gold', '#FF6384', 'indigo', '#FFC234',],
            borderWidth: 2,
            borderRadius: 5,
            barThickness: 24,
          },
        ],
      },
      options: {

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
              stepSize: 30,
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }

      }
    });
  }

  resetChart() {
    this.chart.data.datasets = []
  }



}
// this.chart = new Chart(this.chartEl.nativeElement, {
//   type: 'line',
//   // data: {
//   //   labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//   //   datasets: [
//   //     {
//   //       label: '# of Votes',
//   //       data: [12, 39, 3, 45, 82, 3, 27],
//   //       backgroundColor: [ 'tomato', '#FF9020', '#059BFF', 'rebeccapurple', 'gold', '#FF6384', 'indigo', '#FFC234', ],
//   //       borderWidth: 2,
//   //       borderRadius: 5,
//   //       barThickness: 24,
//   //     },
//   //   ],
//   // },
//       // data: [{ x: 'Sun', y: 12 }, { x: 'Mon', y: 39 }, { x: 'Tue', y: 3 }, { x: 'Wed', y: 45 }, { x: 'Thu', y: 82 }, { x: 'Fri', y: 3 }, { x: 'Sat', y: 27 }],
//   data: {
//     datasets: [{
//         // data: [12, 39, 3, 45, 82, 3, 27],
//       label: '# of Votes',
//       data: [{ x: 'Sun', y: 12 }, { x: 'Mon', y: 39 }],
//       // backgroundColor: ['tomato', '#FF9020', '#059BFF', 'rebeccapurple', 'gold', '#FF6384', 'indigo', '#FFC234'],
//       // borderWidth: 2,
//       // borderRadius: 5,
//       // barThickness: 24,
//     }],
//   },
//   // options: {
//   //   parsing: false,
//   //
//   //   scales: {
//   //     x: {
//   //       border: {
//   //         display: false
//   //       },
//   //       grid: {
//   //         display: false,
//   //         drawTicks: false
//   //       }
//   //     },
//   //     y: {
//   //       position: 'right',
//   //       border: {
//   //         display: false
//   //       },
//   //       grid: {
//   //         display: false
//   //       },
//   //       ticks: {
//   //         stepSize: 30,
//   //       }
//   //     }
//   },
//   plugins: {
//     legend: {
//       display: false
//     }
//   }
//
// }
// });
