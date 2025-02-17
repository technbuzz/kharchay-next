import { IExpense } from "./common-api-interface";

export interface Category {
  title: string;
  icon: string;
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
      { title: 'breakfast', icon: '/assets/custom-icons/breakfast.svg' },
      { title: 'lunch', icon: '/assets/custom-icons/lunch.svg' },
      { title: 'dinner', icon: '/assets/custom-icons/dinner.svg' }
    ]
  },
  {
    title: 'grocery',
    icon: 'cart-outline',
    categories: [
      { title: 'bread', icon: '/assets/custom-icons/bread.svg' },
      { title: 'dairy', icon: '/assets/custom-icons/dairy.svg' },
      { title: 'fruits', icon: '/assets/custom-icons/fruits.svg' },
      { title: 'general', icon: 'cart-outline' },
      { title: 'vegetables', icon: '/assets/custom-icons/vegetables.svg' },
      { title: 'dry fruits', icon: 'cart-outline' },
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
    title: 'other',
    icon: 'ellipsis-horizontal-outline'
  },
]

// export const categories = [
//   { title: 'bills' },
//   { title: 'clothes' },
//   { title: 'entertainment' },
//   {
//     title: 'food', subCategory: [
//       { title: 'breakfast' },
//       { title: 'lunch' },
//       { title: 'dinner' },
//       { title: 'other' }
//     ]
//   },
//   {
//     title: 'grocery', subCategory: [
//       { title: 'bread' },
//       { title: 'dairy' },
//       { title: 'fruits' },
//       { title: 'general' },
//       { title: 'vegetables' },
//       { title: 'dry fruits' },
//       { title: 'other' }]
//   },
//   { title: 'health' },
//   { title: 'Education' },
//   { title: 'snacks' },
//   { title: 'transport' },
//   { title: 'toiletry' },
//   { title: 'other' }
// ];

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
