import { Component, Input, ChangeDetectionStrategy, OnInit, SimpleChange } from '@angular/core';

declare let Chartist: any;

interface Slice {
  color: string;
  value: number;
  startAngle: number;
}

@Component({
  selector: 'pie',
  templateUrl: 'pie.html',
  styleUrls: ['pie.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieComponent implements OnInit{

  @Input('labels') labels: string[];
  @Input('data') data: number[];

  colors: string[] = ['tomato', 'chocolate', 'steelblue', 'rebeccapurple', 'teal','deeppink', 'indigo']
  prevAngle: number = 0;
  public dataSet = {
    labels: ['a','b','c'],
    series: [1,2,3]
  };
  slices: Slice[];

  constructor() {}

  ngOnInit() {
    
    this.dataSet = {
      labels: this.labels,
      series: this.data
    };

    // this.zone.run(() => {
    //   const chart = new Chartist.Pie('.ct-chart', this.dataSet, {
    //     donut:true,
    //     donutWidth: 60,
    //     donutSolid: true,
    //     startAngle: 270,
    //     showLabel: true,
    //     labelPosition: 'outside'
    //   });

    //   console.log('chart: ', chart);
    // })

  }

  ngOnChanges (changes) {
    const { data, labels }:{data:SimpleChange, labels:SimpleChange} = changes
    if (!data.currentValue) return
    const total = data && data.currentValue.reduce((a,b) => a + b)
    this.slices = data.currentValue.map((item, i) => {
      return { 
        value: item / total, 
        color: this.colors[i],
        startAngle: (item / total)* 360
      }
    })
    console.log('total: ', total);
    console.log('percentages: ', this.slices);
    
  }

  calcSlice (percent:Slice): string {
    // circumference formula 2PIr
    console.log(percent, `${percent.value * 31.42 } 31.42`)
    return `${percent.value * 31.42 } 31.42`
  }

  calcStartAngle (angle: number, index: number): string {
    let result = ''
    // if (index === 0) {
    //   result = 'rotate(0 10 10)'
    // } else {
      result = `rotate(${this.prevAngle} 10 10)`
    // }

    this.prevAngle += angle
    return result;
  }

  toggle(item) {
    const index = this.labels.indexOf(item);
    const result = this.labels.splice(index, 1);
    console.log('result: ', result);
    console.log('this.doughnutChartLabels: ', this.labels);
  }
}
