import { IExpense } from "@models";

export type Category = {
  title: string;
  icon ?: string
  img ?: string
  categories?: Category[]
}

export const categories: Category[] = [
  {
    title: 'bills',
    icon: 'receipt-outline',
  },
  {
    title: 'clothes',
    icon: 'shirt-outline',
  },
  {
    title: 'entertainment',
    icon: 'bowling-ball-outline'
  },
  {
    title: 'food',
    icon: 'restaurant-outline',
    categories: [
      { title: 'breakfast', img: '/assets/custom-icons/breakfast.svg' },
      { title: 'lunch', img: '/assets/custom-icons/lunch.svg' },
      { title: 'dinner', img: '/assets/custom-icons/dinner.svg' }
    ]
  },
  {
    title: 'grocery',
    icon: 'cart-outline',
    categories: [
      { title: 'bread', img: '/assets/custom-icons/bread.svg' },
      { title: 'dairy', img: '/assets/custom-icons/dairy.svg' },
      { title: 'fruits', img: '/assets/custom-icons/fruits.svg' },
      { title: 'general', icon: 'cart-outline' },
      { title: 'vegetables', img: '/assets/custom-icons/vegetables.svg' },
      { title: 'dry fruits', icon: 'cart-outline' },
      { title: 'meat', img: '/assets/custom-icons/meat.svg' },
      { title: 'other', icon: 'cart-outline' }
    ]
  },
  {
    title: 'health',
    icon: 'medkit-outline'
  },
  {
    title: 'education',
    icon: 'school-outline'
  },
  {
    title: 'snacks',
    icon: 'fast-food-outline'
  },
  {
    title: 'transport',
    icon: 'train-outline'
  },
  {
    title: 'toiletry',
    icon: 'cut-outline'
  },
  {
    title: 'household',
    img: '/assets/custom-icons/household.svg'
  },
  {
    title: 'other',
    icon: 'ellipsis-horizontal-outline'
  },
]


export const mapSubCategory = (expense: IExpense): IExpense => {
  if (typeof expense.subCategory === 'object') {
    return { ...expense, subCategory: expense.subCategory };
  } else if (typeof expense.subCategory === 'string') {
    return { ...expense, subCategory: { title: expense.subCategory } };
  }
  return expense;
};
export const mapCategory = (expense: IExpense): IExpense => {
  if (typeof expense.category === 'object') {
    return { ...expense, category: expense.category };
  } else if (typeof expense.category === 'string') {
    return { ...expense, category: { title: expense.category } };
  }
  return expense;
};
