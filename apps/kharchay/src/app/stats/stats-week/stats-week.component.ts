import { AfterViewInit, Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarController, BarElement, CategoryScale, Chart, Tooltip } from 'chart.js';

// Chart.register(BarController, BarElement, Tooltip, CategoryScale, LinearScale, TimeScale);
Chart.register(BarController, BarElement, Tooltip, CategoryScale );
@Component({
  selector: 'kh-stats-week',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-week.component.html',
  styleUrl: './stats-week.component.scss',
  host: { class: 'block' }
})
export class StatsWeekComponent implements AfterViewInit {

  protected label = input(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])

  data = input()
  chartEl = viewChild.required('container', { read: ElementRef<HTMLCanvasElement> })
  #chart!: Chart;

  constructor() {
    effect(() => {
      let data = this.data()

      if(data) {
        this.#chart.data.datasets = []
        let weekStyles = {
          barThickness: 24,
          borderWidth: 2,
          borderRadius: 5,
          data,
          backgroundColor: '#191928',
        }
        // @ts-ignore
        this.#chart.data.datasets.push(weekStyles)
        console.log(this.#chart.data)
      }
    })

  }

  ngAfterViewInit(): void {

    this.#chart = new Chart(this.chartEl().nativeElement, {
      type: 'bar',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          {
            label: '# of Votes',
            data: [22,33,44,55,66,77,88],
          },
        ],
      },
      options: {
        // onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
        //   console.log(elements.at(0))
        //   // const canvasPosition = getRelativePosition(e, );
        //   //
        //   //   // Substitute the appropriate scale IDs
        //   // const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
        //   // const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
        //   //
        // },
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
}
