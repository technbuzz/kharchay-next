import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArcElement, Chart, DoughnutController, Legend, Tooltip, Colors} from "chart.js";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { FirebaseAdapterService } from "@kh/common/data-adapters";
import format from 'date-fns/esm/format'
import startOfMonth from 'date-fns/esm/startOfMonth';
import endOfMonth from 'date-fns/esm/endOfMonth';
import { addMonths, subMonths } from 'date-fns';
import { take, tap } from "rxjs/operators";


Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Colors)
const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 29 },
]

@Component({
  selector: 'kh-overview-month-mini',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './overview-month-mini.component.html',
  styleUrls: ['./overview-month-mini.component.scss'],
})
export class OverviewMonthMiniComponent implements OnInit {
  @ViewChild('wrapper', { static: true }) chartWrapper!: ElementRef
  private chart!: Chart<"doughnut", number[], string>
  protected month = Date.now()

  constructor(private service: FirebaseAdapterService) { }


  ngOnInit(): void {

    const basicStartMonth = startOfMonth(this.month);
    const basicEndMonth = endOfMonth(this.month);
    this.service.summaryByMonth('expense', basicStartMonth, basicEndMonth).pipe(
      take(1),
      tap((resp:any) => this.initChart(resp))
    ).subscribe()
    //https://coolors.co/d45088-ddc0bc-a15295-f05f6c-f57b49-f48d3b-23485b-685192
  }

  private initChart(data: {chartLabel: string[], chartData: number[]}) {
    this.chart = new Chart(this.chartWrapper.nativeElement, {
      type: 'doughnut',
      data: {

        labels: data.chartLabel,
        datasets: [{
          hoverOffset: 4,
          data: data.chartData
        }]
      },
      options: {
        responsive: false,
        aspectRatio: 1,
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
    })
  }

  next() {

    const nextMonth = addMonths(this.month, 1)
    const basicStartMonth = startOfMonth(nextMonth);
    const basicEndMonth = endOfMonth(nextMonth);
    // console.log({basicStartMonth, basicEndMonth})
    this.service.summaryByMonth('expense', basicStartMonth, basicEndMonth).pipe(
      take(1),
      tap((resp:any) => this.updateChartData(resp)),
      tap(() => this.month = basicStartMonth.getTime())
    ).subscribe(console.log)
    // console.log({ nextMOnth: addMonths(this.month, 1)})
  }

  prev() {
    const prevMonth = subMonths(this.month, 1)
    const basicStartMonth = startOfMonth(prevMonth);
    const basicEndMonth = endOfMonth(prevMonth);
    this.service.summaryByMonth('expense', basicStartMonth, basicEndMonth).pipe(
      take(1),
      tap((resp:any) => this.updateChartData(resp)),
      tap(() => this.month = basicStartMonth.getTime())
    ).subscribe(console.log)
    // console.log({ prevMOnth: subMonths(this.month, 1)})
  }

  private updateChartData(data: any) {
    this.updateLabels(this.chart, data.chartLabels)
    this.updateData(this.chart, data.chartData)

    // this.removeData(this.chart)
    // this.addData(this.chart, data.chartData, data.chartLabel)
  }

  private updateLabels(chart: Chart<"doughnut", number[], string>, labels: any) {
    chart.data.labels = [];
    chart.data.labels = [...labels]
    chart.update();
  }

  private updateData(chart: Chart<"doughnut", number[], string>, data: any) {

    chart.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });
    chart.data.datasets.forEach((dataset) => {
      dataset.data = [...data];
    });
    chart.update();
  }

}
