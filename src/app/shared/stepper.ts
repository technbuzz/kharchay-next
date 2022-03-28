import addMonths from 'date-fns/esm/addMonths';
import subMonths from 'date-fns/esm/subMonths';
import isAfter from 'date-fns/esm/isAfter';
import { IonDatetime } from '@ionic/angular';

export class Stepper {
  addMonth(date): string{
    const nextMonth = addMonths(new Date(date), 1);
    if(isAfter(nextMonth, new Date())) {return;}
    return nextMonth.toISOString();
  }

  subMonth(date): string {
    return subMonths(new Date(date), 1).toISOString();
  }

}
