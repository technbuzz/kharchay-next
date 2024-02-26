import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArcElement, Chart, DoughnutController, Legend, Tooltip, Colors} from "chart.js";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { FirebaseAdapterService } from "@kh/common/data-adapters";
import { addMonths, endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { catchError, map, take, tap } from "rxjs/operators";
import {take as loTake } from 'lodash-es'
import { of } from 'rxjs';


Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Colors)

@Component({
  selector: 'kh-overview-month-mini',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './overview-month-mini.component.html',
  styleUrls: ['./overview-month-mini.component.scss'],
  exportAs: 'miniTransaction'
})
export class OverviewMonthMiniComponent implements OnInit {
  @ViewChild('wrapper', { static: true }) chartWrapper!: ElementRef
  private chart!: Chart<"doughnut", number[], string>
  protected month = Date.now()

  /*
  * used to communicate to other component via
  * exportAs
  */
  public selMonth!: { date: number, topExpenses: any[]}

  constructor(private service: FirebaseAdapterService) { }


  ngOnInit(): void {
    const basicStartMonth = startOfMonth(this.month);
    const basicEndMonth = endOfMonth(this.month);
    this.service.summaryByMonth('expense', basicStartMonth, basicEndMonth).pipe(
      take(1),
      map((values:any) => this.makeArrays(values)),
      catchError(() => of({chartLabel: [], chartData: []})),
      tap((resp:any) => this.initChart(resp))
    ).subscribe()
    //https://coolors.co/d45088-ddc0bc-a15295-f05f6c-f57b49-f48d3b-23485b-685192
  }

  private makeArrays(values:Array<{key:string, value: number}>) {
    const chartData: number[] = [];
    const chartLabels: string[] = [];



    this.selMonth = {
      date: this.month,
      topExpenses : values.filter(item => item.key ==='bills' || item.key === 'grocery')
    }
    loTake(values, 3).map(item => {
        chartLabels.push(item.key.toUpperCase());
        chartData.push(item.value);
      })
    return {chartData, chartLabels}

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
      map((values:any) => this.makeArrays(values)),
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
      map((values:any) => this.makeArrays(values)),
      tap((resp:any) => this.updateChartData(resp)),
      tap(() => this.month = basicStartMonth.getTime())
    ).subscribe(console.log)
    // console.log({ prevMOnth: subMonths(this.month, 1)})
  }

  private updateChartData(data: any) {
    this.updateLabels(this.chart, data.chartLabels)
    this.updateData(this.chart, data.chartData)
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
