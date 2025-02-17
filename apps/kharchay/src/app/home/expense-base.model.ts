import { IExpense } from "@models";

export interface BaseExpense extends IExpense {
  id?: string,
  dateModified?: string,
}

