import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { IExpense } from '../../shared/expense.interface'

@Component({
  selector: 'recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss'],
})
export class RecurringComponent implements OnInit {

  @Input() loading: boolean = false
  @Input() expenses: IExpense[]
  @Output() confirmExpense = new EventEmitter()

  constructor() { }

  ngOnInit() {}

  submit(item: IExpense) {
    if (this.loading) {
      return
    }
    this.confirmExpense.emit(item)
  }
}
