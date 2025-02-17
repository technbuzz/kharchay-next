import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgIf } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GeneralService } from '../../shared/general.service';
import { DatabaseAdapter } from '@data-access';
import { SettingsService } from '../../shared/settings.service';


@Component({
    selector: 'kha-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, NgIf, MatProgressBarModule, MatSidenavModule, MatListModule, RouterLinkActive, RouterLink, RouterOutlet, AsyncPipe],
})
export class DashboardComponent implements OnInit, AfterContentInit, AfterViewInit {
  private dbAdapter = inject(DatabaseAdapter);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected settingService = inject(SettingsService);
  gs = inject(GeneralService);
  private breakpointObserver = inject(BreakpointObserver);


  @ViewChild('snav') snav!: MatSidenav;
  @ViewChild('vc', { read: ViewContainerRef }) vc!: ViewContainerRef;

  querying$ = this.gs.querying;

  protected title$!: Observable<string>;
  protected bcrumbsEnabled = this.settingService.settings$.pipe(map(v => v.breadcrumbs))

  media$ = this.breakpointObserver.observe([
    Breakpoints.XSmall
  ])

  ngAfterViewInit(): void {
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   map(() => this.route)
    // )
    //   .subscribe((rep: ActivatedRoute) => {
    //     this.snav.close()
    //   })
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

  logout() {
    this.dbAdapter.signOutVoid()
    this.router.navigate(['/login'])
  }

}
