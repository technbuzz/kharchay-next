import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ArcElement, Chart, Legend, PieController, Tooltip } from 'chart.js';

@Component({
    selector: 'kh-doughnut',
    template: `
    <div class="wrapper">
      <canvas #container width="400" height="400"></canvas>

    </div>
  `,
    standalone: true
})
export class DoughnutComponent implements OnInit, AfterViewInit {
  @Input() set chartData(data: number[]) {
    this.updateData(this.chart, data)
  }

  @Input() set chartLabel(label: string[]) {
    this.updateLabels(this.chart, label)
  }


  @ViewChild('container') container!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    Chart.register(PieController, ArcElement, Legend, Tooltip);
    //@ts-ignore:w
    //
    this.chart = new Chart(this.container.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            hoverOffset: 4,
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'tomato',
              '#FF9020',
              '#059BFF',
              'rebeccapurple',
              'gold',
              '#FF6384',
              'indigo',
              '#FFC234',
            ]
          },
        ],
      },
      options: {
        layout: {
          padding: 10,
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      }
    });

  }

  updateLabels(chart: Chart, label: string[]) {
    if(!chart) return;
    chart.data.labels = [];
    chart.data.labels = [...label]
    chart.update();
  }

  updateData(chart: Chart, data:number[]) {
    if(!chart) return;
    chart.data.datasets.forEach((dataset) => {
      //@ts-ignore
      dataset.data == [];
    });
    chart.data.datasets.forEach((dataset) => {
      dataset.data = [...data];
    });
    chart.update();

  }

  addData(chart: Chart, label: string[], data: number[]) {
    chart.data.labels = [...label]
    chart.data.datasets.forEach((dataset) => {
      dataset.data = [...data];
    });
    chart.update();
  }

  removeData(chart: Chart) {
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
      //@ts-ignore
      dataset.data == [];
    });
    chart.update();
  }
}
