import { ICategory, IExpense } from "@kh/common/api-interface"

export class Expense implements IExpense {

  // date: Date = null
  // price: number
  // note: string
  // imageName: string
  // category: ICategory
  // subCategory?: ICategory
  // fixed?: boolean

  constructor(private price: any, private note: string, 
    private imageName: string, private category: ICategory, private date:any, private subCategory?: ICategory, private fixed?: boolean ) {
    this.price = price 
    this.note = note
    this.imageName = imageName
    this.category = category
    this.date = new Date(date)
    this.subCategory = subCategory
    this.fixed = fixed
  }
}