import { Directive, ElementRef } from '@angular/core';
import { fromEvent, Subscription, asyncScheduler } from 'rxjs';
import { buffer, throttleTime, map, filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Directive({
    selector: '[app-stream]',
    standalone: true
})
export class StreamDirective {
  subscriptions = new Subscription();

  constructor(private el: ElementRef, private router: Router) {
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
