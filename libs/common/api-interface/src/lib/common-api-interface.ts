

export interface IExpense {
  id?: string;
  price: number|null;
  note: string;
  category: ICategory;
  date: Date|any;
  details?: boolean;
  imageName: string;
  imageUrl?: string;
  subCategory?: ICategory;
  fixed?: boolean | null;
}

export interface ICategory {
  title: string;
  subCategory?: SubCategory[];
}

interface SubCategory extends ICategory{
  id?: number;
}