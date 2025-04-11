import { AfterViewInit, ChangeDetectorRef, Component, computed, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { getDate } from 'date-fns/getDate';
import { StatsService } from '../stats.service';
import { IExpense } from '@models';

@Component({
  selector: 'kh-stats-month',
  standalone: true,
  templateUrl: './stats-month.component.html',
  styleUrl: './stats-month.component.scss',
  host: { class: 'block' }
})
export class StatsMonthComponent implements AfterViewInit {

  data = input.required<IExpense[]>()
  chartEl = viewChild.required('container', { read: ElementRef<HTMLCanvasElement> })
  #chart!: Chart;
  cd = inject(ChangeDetectorRef)
  protected service = inject(StatsService);


  $expensesGroupedByMonth = computed(() => {
    let expenses = this.data()
    console.log(expenses)
    let grouped = Object.groupBy(expenses, expense => getDate(expense.date.toDate()))
    // FIXME:
    // @ts-ignore
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
        this.#chart.update()
        this.cd.markForCheck()
        console.log('chart updated')
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
