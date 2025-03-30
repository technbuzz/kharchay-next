import { computed, Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Category } from '@models';

@Directive({ selector: '[decideIcon]' })
export class DecideIconDirective {


  decideIconFrom = input.required<TemplateRef<any>>()

  decideIconWith = input.required<TemplateRef<any>>()

  decideIconFor = input<Category>()
  #vcr = inject(ViewContainerRef)


  config = computed(() => {
    return {
      icon: this.decideIconFrom(),
      img: this.decideIconWith(),
      category: this.decideIconFor()
    }

  })



  constructor() {
    effect(() => {
      if(this.config().category?.icon) {
        this.#vcr.createEmbeddedView(this.config().icon, { category: this.config().category })
      } else {
        this.#vcr.createEmbeddedView(this.config().img, { category: this.config().category })
      }
    })

  }

}
