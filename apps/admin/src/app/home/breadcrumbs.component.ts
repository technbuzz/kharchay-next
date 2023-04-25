import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { warn } from 'console';

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
  @Input() crumbs !:any;
  constructor() { }

  ngOnInit() { }
}
