import {addMonths} from 'date-fns/addMonths';
import {subMonths} from 'date-fns/subMonths';
import {isAfter} from 'date-fns/isAfter';

import {format} from 'date-fns';
export class Stepper {
  addMonth(date:any): string{
    const nextMonth = addMonths(new Date(date), 1);
    if(isAfter(nextMonth, new Date())) {return date;}
    return this.formatMonth(nextMonth);
  }

  subMonth(date:any): string {
    return this.formatMonth(subMonths(new Date(date), 1))
  }

  formatMonth(date: Date): string {
    return format(date, 'yyyy-MM')
  }

}
