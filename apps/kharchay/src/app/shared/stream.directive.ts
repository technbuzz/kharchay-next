import { Directive, ElementRef, inject } from '@angular/core';
import { fromEvent, Subscription, asyncScheduler } from 'rxjs';
import { buffer, throttleTime, map, filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Directive({
    selector: '[app-stream]',
    standalone: true
})
export class StreamDirective {
  private el = inject(ElementRef);
  private router = inject(Router);

  subscriptions = new Subscription();

  constructor() {
    const secretElement = this.el.nativeElement;

    const clickStream = fromEvent(secretElement, 'click');
    this.subscriptions.add(clickStream
      .pipe(
        buffer(clickStream.pipe(throttleTime(600, asyncScheduler, { leading: false, trailing: true }))),
        map(arr => arr.length),
        filter(len => len === 4)
      )
      .subscribe(resp => {
        console.log('clicked', resp);
        this.router.navigate(['/settings'])
      }))
  }

}
