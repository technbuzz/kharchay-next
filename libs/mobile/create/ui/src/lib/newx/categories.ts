
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
      { title: 'dairy' , icon: '/assets/custom-icons/dairy.svg' },
      { title: 'fruits' , icon: '/assets/custom-icons/fruits.svg' },
      { title: 'general' , icon: 'cart-outline' },
      { title: 'vegetables' , icon: '/assets/custom-icons/vegetables.svg' },
      { title: 'dry fruits' , icon: 'cart-outline' },
      { title: 'other' , icon: 'cart-outline' }
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
