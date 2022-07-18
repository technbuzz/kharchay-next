import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from "@angular/fire/auth";
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BreadcrumbsService } from '../../shared/breadcrumbs.service';
import { GeneralService } from '../../shared/general.service';


@Component({
  selector: 'kha-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentInit{

  @ViewChild(MatDrawer, {static: true}) drawer!: MatDrawer;

  querying$ = this.gs.querying;

  title$!: Observable<string>;
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

  }
  ngAfterContentInit(): void {
    this.title$ = this.gs.title;
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
