import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js';

@Component({
  selector: 'kh-stats-month',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-month.component.html',
  styleUrl: './stats-month.component.scss',
})
export class StatsMonthComponent implements AfterViewInit {

  data = input()
  chartEl = viewChild.required('container', { read: ElementRef<HTMLCanvasElement> })
  #chart!: Chart;

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
        // onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
          // console.log(elements.at(0))
          // const canvasPosition = getRelativePosition(e, );
          //
          //   // Substitute the appropriate scale IDs
          // const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
          // const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
          //
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
