import { Component, OnInit, Input } from '@angular/core';
import { IExpense } from 'src/app/shared/expense.interface';

@Component({
  selector: 'recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss'],
})
export class RecurringComponent implements OnInit {

  @Input() loading;

  constructor() { }

  ngOnInit() {}

  @Input() expenses:IExpense[]

}
