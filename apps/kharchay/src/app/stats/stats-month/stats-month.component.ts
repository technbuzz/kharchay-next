import { AfterViewInit, Component, computed, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js';
import { StatsService } from '../stats.service';
import { getDate } from 'date-fns/getDate';

@Component({
  selector: 'kh-stats-month',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-month.component.html',
  styleUrl: './stats-month.component.scss',
  host: { class: 'block' }
})
export class StatsMonthComponent implements AfterViewInit {

  data = input()
  chartEl = viewChild.required('container', { read: ElementRef<HTMLCanvasElement> })
  #chart!: Chart;
  protected service = inject(StatsService);


  $expensesGroupedByMonth = computed(() => {
    let expenses = this.data()
    // @ts-ignore
    let grouped = Object.groupBy(expenses, expense => getDate(expense.date.toDate()))
    return this.service.reduceGrouped(grouped)
  })


  $updatedLabel = computed(() => {
    const days = this.service.$daysInPeriod()
    let labels = Array.from({ length: days}, (_, i) => i + 1)
    return labels
  })


  constructor() {
    effect(() => {
      let data = this.$expensesGroupedByMonth()

      if(data) {
        this.#chart.data.labels = this.$updatedLabel();
        this.#chart.data.datasets = []
        let monthStyles = {
          borderRadius: 5,
          barThickness: 4,
          data,
          backgroundColor: '#191928',
        }
        // @ts-ignore
        this.#chart.data.datasets.push(monthStyles)
      }
    })

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
