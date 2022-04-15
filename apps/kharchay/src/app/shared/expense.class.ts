import { IExpense } from './expense.interface';
import { ICategory } from './category.interface';

export class Expense implements IExpense {

  date: Date = new Date();
  price: number
  note: string
  imageName: string
  category: ICategory
  subCategory?: ICategory
  fixed?: boolean

  constructor(price:number, note:string, imageName:string, category:any, date:Date, subCategory?: any, fixed?:boolean ) {
    this.price = price 
    this.note = note
    this.imageName = imageName
    this.category = category
    this.date = new Date(date)
    this.subCategory = subCategory
    this.fixed = fixed
  }
}
