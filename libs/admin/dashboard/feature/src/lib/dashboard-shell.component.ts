import { Component } from '@angular/core';
import { warn } from 'console';

@Component({
  selector: 'kh-dashboard-shell',
  template: `
  <div class="wrapper grid grid-cols-3 grid-rows-2 gap-3 h-full">
    <kh-transactions-mini class="col-span-2"></kh-transactions-mini>
    <kh-overview-month-mini></kh-overview-month-mini>
  </div>
`,
  styles: [`
    :host { @apply block h-full p-3 }
`],
})
export class DashboardShellComponent {}
