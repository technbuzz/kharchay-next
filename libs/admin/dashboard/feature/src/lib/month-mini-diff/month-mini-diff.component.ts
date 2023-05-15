import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'kh-month-mini-diff',
  standalone: true,
  imports: [CommonModule, MatListModule, MatProgressBarModule, MatIconModule],
  templateUrl: './month-mini-diff.component.html',
  styleUrls: ['./month-mini-diff.component.scss'],
})
export class MonthMiniDiffComponent {

folders: any[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
  ];
}
