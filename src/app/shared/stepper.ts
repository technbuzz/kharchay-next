import * as addMonths from "date-fns/add_months";
import * as subMonths from "date-fns/sub_months";
import * as isAfter from "date-fns/is_after";
import { IonDatetime } from "@ionic/angular";

export class Stepper {
  addMonth(date, element:IonDatetime){
    let nextMonth = addMonths(date, 1);
    if(isAfter(nextMonth, new Date())) return;
    element.value = nextMonth.toISOString();
  }
  
  subMonth(date, element:IonDatetime){
    element.value = subMonths(date, 1).toISOString();
  }

}