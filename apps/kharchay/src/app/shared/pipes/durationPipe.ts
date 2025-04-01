import { Pipe, PipeTransform } from '@angular/core';
import { endOfMonth } from "date-fns/endOfMonth";
import { endOfWeek } from "date-fns/endOfWeek";
import { startOfMonth } from "date-fns/startOfMonth";
import { startOfWeek } from "date-fns/startOfWeek";
import { format } from 'date-fns/format';

@Pipe({
  name: 'duration',
})

export class DurationDisplayPipe implements PipeTransform {
  transform(value: { period: string, timestamp: number }, ...args: any[]): any {
    switch (value?.period) {
      case 'week': {
        const start = startOfWeek(new Date(value.timestamp))
        const end = endOfWeek(new Date(value.timestamp))
        return `${format(start, 'd MMM')} to ${format(end, 'd MMMM yyyy')}`
      }
      case 'month': {
        const start = startOfMonth(new Date(value.timestamp))
        const end = endOfMonth(new Date(value.timestamp))
        return `${format(start, 'd')} to ${format(end, 'd MMMM yyyy')}`
      }
      default:
        return ''
    }

  }
}
