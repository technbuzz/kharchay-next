import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { warn } from 'console';
import { BreadcrumbsService } from '../shared/breadcrumbs.service';

@Component({
  selector: 'kha-breadcrumbs',
  standalone: true,
  template: `
    <ul class="breadcrumbs">
      <li class="breadcrumb" *ngFor="let crumb of crumbs">
        <a [routerLink]="crumb.path">{{ crumb.label }}</a>
      </li>
    </ul>
  `,
  imports: [CommonModule, RouterModule],
  styles:[`
      .breadcrumbs {
        padding: 0.5rem 1rem;
        .breadcrumb {
          display: inline-block;
          margin-right: 1.5em;
          position: relative;

          a {
            text-decoration: none;
          }

          &::after {
            position: absolute;
            content: ">";
            left: 115%;
          }

          &:last-child {
            &::after{
              display: none;
            }
          }
        }
      }
    `]
})

export class BreadcrumbsComponent implements OnInit {
  crumbs !: any;
  // @Input() crumbs !:any;
  constructor(

    private breadcrumbsService: BreadcrumbsService,
  ) { }

  ngOnInit() {

    this.breadcrumbsService.breadcrumbs$.subscribe(x => {
      this.crumbs = x;
    });
  }
}
