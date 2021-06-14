import { Component, Input, ChangeDetectionStrategy, ElementRef, NgZone, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';

import { Chart } from 'frappe-charts/dist/frappe-charts.esm.js';
import 'frappe-charts/dist/frappe-charts.min.css';
@Component({
  selector: 'pie',
  templateUrl: 'pie.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieComponent implements OnInit{

  @Input('doughnutChartLabels') doughnutChartLabels: string[];
  @Input('doughnutChartData') doughnutChartData: number[];

  public dataSet = {
    labels: ['a','b','c'],
    datasets: [
      {
        values: [1,2,3]
      }
    ]
  };

  // @Output()
  // chartClicked = new EventEmitter();


  public doughnutChartType: ChartType = 'doughnut';
  donutOptions: any = {
    legend: {
      display: true,
      position: 'right',
      labels: {
        // fontColor: 'rgb(255, 99, 132)'
      }
    },
  };


  constructor() {}

  ngOnInit() {
    this.dataSet = {
      labels: this.doughnutChartLabels,
      datasets: [ {
        values: this.doughnutChartData
      }]
    };
  }
}
