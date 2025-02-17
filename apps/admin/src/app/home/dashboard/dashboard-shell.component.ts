import { Component } from '@angular/core';
import { MonthMiniDiffComponent } from './month-mini-diff/month-mini-diff.component';
import { OverviewMonthMiniComponent } from './overview-month-mini/overview-month-mini.component';
import { TransactionsMiniComponent } from './transactions-mini/transactions-mini.component';

@Component({
    selector: 'kh-dashboard-shell',
    template: `
  <div class="wrapper grid grid-cols-3 grid-rows-2 gap-3 h-full">
    <kh-transactions-mini class="col-span-2"></kh-transactions-mini>
    <div>
      <kh-overview-month-mini #mini="miniTransaction"></kh-overview-month-mini>
      <kh-month-mini-diff [currMonth]="mini.selMonth"></kh-month-mini-diff>
    </div>
  </div>
`,
    styles: [`
    :host { @apply block h-full p-3 }
`],
    standalone: true,
    imports: [
        TransactionsMiniComponent,
        OverviewMonthMiniComponent,
        MonthMiniDiffComponent,
    ],
})
export class DashboardShellComponent {}
