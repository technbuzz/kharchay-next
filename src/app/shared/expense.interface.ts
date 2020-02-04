import { ICategory } from "./category.interface";

export interface IExpense {
  id?: number|string,
  price: number,
  note: string,
  category: ICategory,
  date: Date|any,
  details?: boolean,
  imageName: string,
  imageUrl?: string
  subCategory?: ICategory | string
  fixed?: boolean
}