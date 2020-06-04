import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { Injectable } from "@angular/core";

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  // overrides = <any>{
  //   pan: { direction: Hammer.DIRECTION_ALL },
  //   swipe: { direction: Hammer.DIRECTION_VERTICAL }
  // }

  buildHammer(element: HTMLElement) {
    const mc = new (<any>window).Hammer(element);

    for (const eventName in this.overrides) {
      if (eventName) {
        mc.get(eventName).set(this.overrides[eventName]);
      }
    }

    return mc;
  }
}