import { IExpense } from './expense.interface';

export const categories = [
  { title: 'bills' },
  { title: 'clothes' },
  { title: 'entertainment' },
  {
    title: 'food', subCategory: [
      { title: 'breakfast' },
      { title: 'lunch' },
      { title: 'dinner' },
      { title: 'other' }
    ]
  },
  {
    title: 'grocery', subCategory: [
      { title: 'bread' },
      { title: 'dairy' },
      { title: 'fruits' },
      { title: 'general' },
      { title: 'vegetables' },
      { title: 'dry fruits' },
      { title: 'other' }]
  },
  { title: 'health' },
  { title: 'Education' },
  { title: 'snacks' },
  { title: 'transport' },
  { title: 'toiletry' },
  { title: 'other' }
];

export const mapSubCategory = (expense: IExpense): IExpense => {
  if (typeof expense.subCategory === 'object') {
    return {...expense, subCategory: expense.subCategory};
  } else if (typeof expense.subCategory === 'string') {
    return {...expense, subCategory: { title: expense.subCategory}};
  }
  return expense;
};
export const mapCategory = (expense: IExpense): IExpense => {
  if (typeof expense.category === 'object') {
    return {...expense, category: expense.category};
  } else if (typeof expense.category === 'string') {
    return {...expense, category: { title: expense.category}};
  }
  return expense;
};
