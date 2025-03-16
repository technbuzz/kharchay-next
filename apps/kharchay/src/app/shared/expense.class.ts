import { ICategory, IExpense } from "@kh/common/api-interface"

export class Expense implements IExpense {

  // date: Date = null
  // price: number
  // note: string
  // imageName: string
  // category: ICategory
  // subCategory?: ICategory
  // fixed?: boolean

  constructor(public price: any, public note: string, 
    public imageName: string, public category: ICategory, public date:any, public subCategory?: ICategory, public fixed?: boolean ) {
    this.price = price 
    this.note = note
    this.imageName = imageName
    this.category = category
    this.date = new Date(date)
    this.subCategory = subCategory
    this.fixed = fixed
  }
}