import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'
import { MatTableModule } from "@angular/material/table";
import { FirebaseAdapterService } from '@data-access'

@Component({
  selector: 'kh-transactions-mini',
  standalone: true,
  imports: [CommonModule,  MatCardModule, MatButtonModule, MatTableModule],
  templateUrl: './transactions-mini.component.html',
  styleUrls: ['./transactions-mini.component.scss'],
})
export class TransactionsMiniComponent {
  displayedColumns: string[] = ['date', 'category', 'price'];
  service = inject(FirebaseAdapterService)
  dataSource = this.service.recentTransactions()
}
