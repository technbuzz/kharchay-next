import { inject, Injectable, Signal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

interface Queries {
  period: 'week' | 'month' | 'year',
  timestamp: number
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  route = inject(ActivatedRoute);

  // qParams$: Observable<Queries> = this.route.queryParams;

  $queries = toSignal(this.route.queryParamMap.pipe(
    map(q =>
      ({
        period: q.get('period') ?? 'week',
        timestamp: q.get('timestamp') ?? new Date().getTime()
      })
    )
  ))





}
