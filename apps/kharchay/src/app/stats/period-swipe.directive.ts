import { AfterViewInit, Directive, ElementRef, inject, OnDestroy, output } from '@angular/core';
import { Router } from '@angular/router';
import { PointerListener } from 'contactjs';
import { StatsService } from './stats.service';
import { addWeeks } from 'date-fns/addWeeks';
import { subWeeks } from 'date-fns/subWeeks';

@Directive({
  selector: '[khPeriodSwipe]',
  standalone: true
})
export class PeriodSwipeDirective implements AfterViewInit, OnDestroy{

  el = inject(ElementRef);
  router = inject(Router);
  service = inject(StatsService);


  $queries = this.service.$queries;

  swipeRight = output<Date>()
  swipeLeft = output<Date>()

  swipeRightHandler = () => {
    let timestamp = Number(this.$queries()?.timestamp)
    this.swipeRight.emit(this.subPeriod(timestamp))
  }

  swipeLeftHandler = () => {
    let timestamp = Number(this.$queries()?.timestamp)
    this.swipeLeft.emit(addWeeks(timestamp, 1))
  }

  ngAfterViewInit(): void {

    const pointerListener = new PointerListener(this.el.nativeElement);

    this.el.nativeElement.addEventListener("swiperight", this.swipeRightHandler);

    this.el.nativeElement.addEventListener("swipeleft", this.swipeLeftHandler);
  }

  subPeriod(timestamp: number): Date {
    const period = this.$queries()?.period
    let result;
    switch (period) {
      case 'week':
        result = subWeeks(timestamp, 1)
        break;

      default:
        result = subWeeks(timestamp, 4)
        break;
    }

    return result

  }


  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener("swiperight", this.swipeRightHandler);
    this.el.nativeElement.removeEventListener("swipeleft", this.swipeLeftHandler);
  }

}
