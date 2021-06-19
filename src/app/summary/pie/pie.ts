import { Component, Input, ChangeDetectionStrategy, SimpleChange } from '@angular/core';

interface Slice {
  color: string;
  value: number;
  label: string;
  startAngle: number;
}

@Component({
  selector: 'pie',
  templateUrl: 'pie.html',
  styleUrls: ['pie.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieComponent {

  @Input('labels') labels: string[];
  @Input('data') data: number[];

  colors: string[] = ['tomato', '#FF9020', '#059BFF', 'rebeccapurple', 'gold','#FF6384', 'indigo','#FFC234']
  prevAngle: number = 0;
  slices: Slice[];

  constructor() {}

  ngOnChanges (changes) {
    console.log('changes: ', changes);
    const { data, labels }:{data:SimpleChange, labels:SimpleChange} = changes
    if (data.currentValue && data.currentValue.length) {
      const total = data.currentValue.reduce((a,b) => a + b)
      this.slices = data.currentValue.map((item, i) => ({ 
        value: item / total, 
        color: this.colors[i],
        label: labels.currentValue[i],
        startAngle: (item / total)* 360
      }))
      
    }
  }

  calcSlice (percent:Slice): string {
    // circumference formula 2PIr
    return `${percent.value * 31.42 } 31.42`
  }

  calcStartAngle (angle: number, index: number): string {
    const result = `rotate(${this.prevAngle} 10 10)`
    this.prevAngle += angle
    return result;
  }

  toggle(item) {
    const index = this.labels.indexOf(item);
    const result = this.labels.splice(index, 1);
  }
}
