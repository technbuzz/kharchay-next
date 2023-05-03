import { Component } from '@angular/core';

@Component({
  selector: 'kh-dashboard-shell',
  template: `
  <div class="wrapper grid grid-cols-3 grid-rows-2 h-full">
    <kh-transactions-mini class="col-span-2"></kh-transactions-mini>
  </div>
`,
  styles: [`
    :host { @apply block h-full p-1 }
`],
})
export class DashboardShellComponent {}
