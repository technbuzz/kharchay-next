import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { sortBy, take } from 'lodash-es';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { FirebaseAdapterService } from '@data-access';

@Component({
  selector: 'kh-month-mini-diff',
  standalone: true,
  imports: [CommonModule, MatListModule, MatProgressBarModule, MatIconModule],
  templateUrl: './month-mini-diff.component.html',
  styleUrls: ['./month-mini-diff.component.scss'],
})
export class MonthMiniDiffComponent {
  diffs$!: Observable<any>

  @Input() set currMonth(value: {date: number, topExpenses: any[]}) {
    if(!value) return

    console.log('date', value.date)
    const prevMonth = subMonths(value.date, 1);
    const basicStartMonth = startOfMonth(prevMonth);
    const basicEndMonth = endOfMonth(prevMonth);
    this.diffs$ = this.service.summaryByMonth('expense', basicStartMonth, basicEndMonth).pipe(
      map(values => values.filter(item => item.key === 'bills' || item.key === 'grocery')),
      map(values => sortBy(values, 'key')),
      map(values => this.calcCompare(values, value.topExpenses)),
    )

  }


  constructor(private service: FirebaseAdapterService) {}

  private calcCompare(prevValues: any[], currValues: any[]) {
    console.log({prevValues, currValues})
    const result: any[] = []
    prevValues.forEach((item, idx) => {
      result.push({
        key: item.key,
        value: item.value,
        diff: item.value - currValues[idx].value,
        diffMessage: item.value > currValues[idx].value ? 'current is smaller' : 'current is bigger'

      })

    })
    console.log(result)
    return result

  }

folders: any[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
  ];
}
