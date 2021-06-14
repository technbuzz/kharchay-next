import { Directive, ElementRef, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Chart } from 'frappe-charts/dist/frappe-charts.esm.js';
import 'frappe-charts/dist/frappe-charts.min.css';


@Directive({
  selector: '[appDonut]'
})
export class DonutDirective implements OnChanges{

  @Input() data: any;
  @Output() frappe: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    const chart = new Chart(this.el.nativeElement, {
      data: this.data,
      title: 'My Awesome Chart',
      type: 'donut', // or 'bar', 'line', 'pie', 'percentage'
      height: 300,
      animate: true,
      // tooltipOptions: {
      //   formatTooltipX: (d) => (d + '').toUpperCase(),
      //   formatTooltipY: (d) => d + ' pts'
      // }
    });
    this.frappe.emit(chart)
  }
}
