import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArcElement, Chart, DoughnutController } from "chart.js";
import * as autocolors from 'chartjs-plugin-autocolors';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { FirebaseAdapterService } from "@kh/common/data-adapters";

Chart.register(DoughnutController, ArcElement, autocolors)
const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 },
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
  private chart!: Chart<"doughnut", number[], number>

  constructor(private service: FirebaseAdapterService) { }


  ngOnInit(): void {
    this.chart = new Chart(this.chartWrapper.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.map(row => row.year),
        datasets: [{
          label: 'Acquisation per year',
          data: data.map(row => row.count),
          backgroundColor: [
            'rgb(212, 80, 136)',
            'rgb(161, 82, 149)',
            'rgb(240, 95, 108)',
            'rgb(245, 123, 73)',
            'rgb(244, 141, 59)',
            'rgb(35, 72, 91)',
            'rgb(104, 81, 146)',
            'rgb(44,71,89)',
            // 'rgb(102,178,237)',
            // 'rgb(225,128,94)',
            // 'rgb(255, 205, 86)',
            // 'rgb(85	56	196	)'
          ],
        }]
      },
      // plugins: [autocolors],
    })

    //https://coolors.co/d45088-ddc0bc-a15295-f05f6c-f57b49-f48d3b-23485b-685192
  }
}
