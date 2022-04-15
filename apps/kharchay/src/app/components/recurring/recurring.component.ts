import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { IExpense } from '../../shared/expense.interface'

@Component({
  selector: 'recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss'],
})
export class RecurringComponent {

  @Input() loading = false
  @Input() expenses!: IExpense[]
  @Output() confirmExpense = new EventEmitter()


  submit(item: IExpense) {
    if (this.loading) {
      return
    }
    this.confirmExpense.emit(item)
  }
}
