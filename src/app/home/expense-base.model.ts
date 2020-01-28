import { IExpense } from '../shared/expense.interface';

export interface BaseExpense extends IExpense {
  id?: string,
  dateModified?: string,
}

