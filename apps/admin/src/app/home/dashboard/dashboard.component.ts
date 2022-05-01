import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Auth } from "@angular/fire/auth";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { EventService } from '../../shared/events.service';
import { filter, map } from 'rxjs/operators';
import { GeneralService } from '../../shared/general.service';
import { BreadcrumbsService } from '../../shared/breadcrumbs.service';


@Component({
  selector: 'kha-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatDrawer, {static: true}) drawer!: MatDrawer;

  querying$ = this.gs.querying;

  title: Observable<string>;
  crumbs: any;

  constructor(
    private firebase: Auth,
    private router: Router,
    route: ActivatedRoute,
    private breadcrumbsService: BreadcrumbsService,
    public gs: GeneralService) {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => route)
    ).subscribe((resp:ActivatedRoute) => {
      this.drawer.close()
    })

    this.title = gs.title;
  }

  ngOnInit() {
    this.breadcrumbsService.breadcrumbs$.subscribe(x => {
      this.crumbs = x;
    });


  }

  async logout() {
    await this.firebase.signOut()
    this.router.navigate(['/'])
  }

}
