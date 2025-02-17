import { IExpense } from "@kh/common/api-interface";

export interface BaseExpense extends IExpense {
  id?: string,
  dateModified?: string,
}

