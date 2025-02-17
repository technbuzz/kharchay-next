import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, UrlSegment } from '@angular/router';

interface IBreadcrumb {
  label?: string;
  icon?: string;
  path?: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {
  private router = inject(Router);

  private breadcrumbs = new BehaviorSubject<IBreadcrumb[]>([]);

  constructor() {
    const router = this.router;

    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const currentRoot = this.router.routerState.snapshot.root;
      this.resolveCrumbs(currentRoot).subscribe(x => {
        this.breadcrumbs.next(x);
      });
    });
  }

  get breadcrumbs$(): Observable<IBreadcrumb[]> {
    return this.breadcrumbs;
  }

  private resolveCrumbs(route: ActivatedRouteSnapshot): Observable<IBreadcrumb[]> {
    let crumbs: IBreadcrumb[] = [];

    const data = route.routeConfig && route.routeConfig.data;

    if (data && data['breadcrumb']) {
      crumbs.push(this.resolve(route));
    }

    if (route.firstChild) {
      const childCrumbs = this.resolveChildrenCrumbs(route.firstChild);
      crumbs = crumbs.concat(childCrumbs);
    }

    return of(crumbs);
  }

  private resolveChildrenCrumbs(route: ActivatedRouteSnapshot): IBreadcrumb[] {
    let crumbs: IBreadcrumb[] = [];

    const data = route.routeConfig && route.routeConfig.data;

    if (data && data['title']) {
      crumbs.push(this.resolve(route));
    }

    if (route.firstChild) {
      crumbs = crumbs.concat(this.resolveChildrenCrumbs(route.firstChild));
    }

    return crumbs;
  }

  public resolve(route: ActivatedRouteSnapshot): IBreadcrumb {
    const path = this.getFullPath(route);

    const crumb: IBreadcrumb = {
      // label: route.routeConfig?.data.title || path,
      label: route.routeConfig?.data ? route.routeConfig.data['title'] : path,
      path: path,
    };

    // if (route.routeConfig.data.breadcrumb.icon) {
    //   crumb.icon = route.routeConfig.data.breadcrumb.icon;
    // }

    return crumb;
  }

  private getFullPath(route: ActivatedRouteSnapshot): string {
    const relativePath = (segments: UrlSegment[]) => segments.reduce((a, v) => (a += '/' + v.path), '');
    const fullPath = (routes: ActivatedRouteSnapshot[]) => routes.reduce((a, v) => (a += relativePath(v.url)), '');

    return fullPath(route.pathFromRoot);
  }
}
