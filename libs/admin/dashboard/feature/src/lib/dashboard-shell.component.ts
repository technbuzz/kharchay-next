import { Component } from '@angular/core';

@Component({
  selector: 'kh-dashboard-shell',
  template: `
<kh-transactions-mini></kh-transactions-mini>
`,
  styles: [`
    :host { display: block; padding: 1rem; }
`],
})
export class DashboardShellComponent {}
