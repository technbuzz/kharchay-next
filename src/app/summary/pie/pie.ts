import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';

declare var Chartist: any;

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
    series: [1,2,3]
  };

  constructor() {}

  ngOnInit() {
    this.dataSet = {
      labels: this.doughnutChartLabels,
      series: this.doughnutChartData
    };

    const chart = new Chartist.Pie('.ct-chart', this.dataSet, {
      donut:true,
      donutWidth: 60,
      donutSolid: true,
      startAngle: 270,
      showLabel: true,
      labelPosition: "outside"
    });
    console.log('chart: ', chart);

  }

  toggle (item) {
    const index = this.doughnutChartLabels.indexOf(item)
    const result = this.doughnutChartLabels.splice(index, 1)
    console.log('result: ', result);
    console.log('this.doughnutChartLabels: ', this.doughnutChartLabels);
  }
}
