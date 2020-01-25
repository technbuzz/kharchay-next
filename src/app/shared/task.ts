import { IExpense } from './expense.interface';
import { ICategory } from './category.interface';

export class Task implements IExpense {

  date = new Date()
  price: number
  note: string
  imageName: string
  imageUrl: string
  category: ICategory

  constructor(price, note, imageName, imageUrl, category) {
    this.price = price 
    this.note = note
    this.imageName = imageName
    this.imageUrl = imageUrl
    this.category = category
  }
}
