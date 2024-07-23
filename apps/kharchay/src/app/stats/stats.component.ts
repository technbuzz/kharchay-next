import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Firestore, collection, query, where } from '@firebase/firestore';
import { IonButton, IonContent, IonText } from '@ionic/angular/standalone';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';
import { endOfWeek, startOfWeek } from 'date-fns';
import { StatsService } from './stats.service';
import { Router } from '@angular/router';
import { PeriodSwipeDirective } from './period-swipe.directive';
import { DatePipe, JsonPipe } from '@angular/common';

Chart.register(BarController, BarElement, Tooltip, CategoryScale, LinearScale);
@Component({
  selector: 'kh-stats',
  standalone: true,
  imports: [IonContent, DatePipe, PeriodSwipeDirective, JsonPipe, IonText, IonButton],
  templateUrl: './stats.component.html',
})
export class StatsComponent {

  router = inject(Router);
  service = inject(StatsService);

  $queries = this.service.$queries;

  @ViewChild('container') chartEl!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;


  constructor() {

    let timestamp = Date.now();
    if(this.$queries()?.timestamp) {
      timestamp = Number(this.$queries()?.timestamp)
    }

    const basicStartMonth = startOfWeek(timestamp);
    const basicEndMonth = endOfWeek(timestamp);
    console.log({basicStartMonth, basicEndMonth})
    // const expenseGroup = collection(this.afs, 'expense')
    // const expenseQuery = query(
    //     expenseGroup,
    //     where('date', '>=', basicStartMonth),
    //     where('date', '<=', basicEndMonth),
    // )

  }

  changePeriod(period: string) {
    this.router.navigate([], {queryParams: { period }})
  }

  onSwipeRight(date: Date) {
    console.log(date)
    this.router.navigate([], {queryParams: {timestamp: date.getTime() }, queryParamsHandling: 'merge'} )
  }

  onSwipeLeft(date: Date) {
    console.log(date)
    this.router.navigate([], {queryParams: {timestamp: date.getTime() }, queryParamsHandling: 'merge'} )
  }

  ngAfterViewInit(): void {


    this.chart = new Chart(this.chartEl.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 39, 3, 45, 82, 3, 27],
            backgroundColor: [ 'tomato', '#FF9020', '#059BFF', 'rebeccapurple', 'gold', '#FF6384', 'indigo', '#FFC234', ],
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
}
