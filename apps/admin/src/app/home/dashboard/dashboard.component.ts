import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { SettingsService } from '@kh/admin/settings/data-access';
import { DatabaseAdapter } from '@kh/common/data-adapters';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { GeneralService } from '../../shared/general.service';


@Component({
  selector: 'kha-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChild('snav') snav!: MatSidenav;
  @ViewChild('vc', { read: ViewContainerRef }) vc!: ViewContainerRef;

  querying$ = this.gs.querying;

  protected title$!: Observable<string>;
  protected bcrumbsEnabled = this.settingService.settings$.pipe(map(v => v.breadcrumbs))

  media$ = this.breakpointObserver.observe([
    Breakpoints.XSmall
  ])


  constructor(
    private dbAdapter: DatabaseAdapter,
    private router: Router,
    private route: ActivatedRoute,
    protected settingService: SettingsService,
    public gs: GeneralService,
    private breakpointObserver: BreakpointObserver) {
  }

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route)
    )
      .subscribe((rep: ActivatedRoute) => {
        this.snav.close()
      })
  }
  ngAfterContentInit(): void {
    this.title$ = this.gs.title;
  }

  ngOnInit() {
    this.settingService.settings$.pipe(map(v => v.breadcrumbs), take(1)).subscribe(resp => {
      if (resp) {
        this.#addDynamicComponent()
      }
    })
  }

  async #addDynamicComponent() {
    const bcrumbComponent = (await import('../breadcrumbs.component')).BreadcrumbsComponent;
    this.vc.createComponent(bcrumbComponent)
  }

  async logout() {
    await this.dbAdapter.signOut()
    this.router.navigate(['/login'])
  }

}
