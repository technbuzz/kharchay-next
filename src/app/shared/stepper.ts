import addMonths from 'date-fns/esm/addMonths';
import subMonths from 'date-fns/esm/subMonths';
import isAfter from 'date-fns/esm/isAfter';
import { IonDatetime } from '@ionic/angular';

export class Stepper {
  addMonth(date, element: IonDatetime){
    const nextMonth = addMonths(date, 1);
    if(isAfter(nextMonth, new Date())) {return;}
    element.value = nextMonth.toISOString();
  }

  subMonth(date, element: IonDatetime){
    element.value = subMonths(date, 1).toISOString();
  }

}
