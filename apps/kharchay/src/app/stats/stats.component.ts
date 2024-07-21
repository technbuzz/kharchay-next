import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Firestore, collection, query, where } from '@firebase/firestore';
import { IonButton, IonContent, IonText } from '@ionic/angular/standalone';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';
import { PointerListener } from 'contactjs';
import { endOfWeek, startOfWeek } from 'date-fns';
import { StatsService } from './stats.service';

Chart.register(BarController, BarElement, Tooltip, CategoryScale, LinearScale);
@Component({
  selector: 'kh-stats',
  standalone: true,
  imports: [IonContent, IonText, IonButton],
  templateUrl: './stats.component.html',
})
export class StatsComponent {

  service = inject(StatsService);

  @ViewChild('container') chartEl!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;


  constructor() {

    const basicStartMonth = startOfWeek(new Date());
    const basicEndMonth = endOfWeek(new Date());
    console.log({basicStartMonth, basicEndMonth})
    // const expenseGroup = collection(this.afs, 'expense')
    // const expenseQuery = query(
    //     expenseGroup,
    //     where('date', '>=', basicStartMonth),
    //     where('date', '<=', basicEndMonth),
    // )

  }

  updatePeriod() {

  }

  ngAfterViewInit(): void {
    const pointerListener = new PointerListener(this.chartEl.nativeElement);

    this.chartEl.nativeElement.addEventListener("swiperight", function(event){
      console.log('swiperight', event)
      // do something on tap
    });

    this.chartEl.nativeElement.addEventListener("swipeleft", function(event){
      console.log('swipeleft', event)
      // do something on tap
    });

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
