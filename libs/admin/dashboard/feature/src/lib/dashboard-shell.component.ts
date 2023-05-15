import { Component } from '@angular/core';

@Component({
  selector: 'kh-dashboard-shell',
  template: `
  <div class="wrapper grid grid-cols-3 grid-rows-2 gap-3 h-full">
    <kh-transactions-mini class="col-span-2"></kh-transactions-mini>
    <div>
      <kh-overview-month-mini></kh-overview-month-mini>
      <kh-month-mini-diff></kh-month-mini-diff>
    </div>
  </div>
`,
  styles: [`
    :host { @apply block h-full p-1 }
`],
})
export class DashboardShellComponent {}
