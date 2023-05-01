import { Component } from '@angular/core';

@Component({
  selector: 'kh-dashboard-shell',
  template: `
  <div class="wrapper grid grid-cols-3">
    <kh-transactions-mini class="col-span-2"></kh-transactions-mini>
  </div>
`,
  styles: [`
    :host { display: block; padding: 1rem; }
`],
})
export class DashboardShellComponent {}
