import { AfterViewInit, Directive, ElementRef, inject, OnDestroy, output } from '@angular/core';
import { Router } from '@angular/router';
import { PointerListener } from 'contactjs';
import { StatsService } from './stats.service';

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
    this.swipeRight.emit(this.service.subPeriod(timestamp))
  }

  swipeLeftHandler = () => {
    let timestamp = Number(this.$queries()?.timestamp)
    this.swipeLeft.emit(this.service.addPeriod(timestamp))
  }

  ngAfterViewInit(): void {

    const pointerListener = new PointerListener(this.el.nativeElement);

    this.el.nativeElement.addEventListener("swiperight", this.swipeRightHandler);

    this.el.nativeElement.addEventListener("swipeleft", this.swipeLeftHandler);
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener("swiperight", this.swipeRightHandler);
    this.el.nativeElement.removeEventListener("swipeleft", this.swipeLeftHandler);
  }

}
