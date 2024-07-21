import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class StatsService {
  route = inject(ActivatedRoute);

  $queries = toSignal(this.route.queryParams, { initialValue: { period: 'week' }})

  ngOnInit() {
  }



}
