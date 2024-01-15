import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonGrid, IonInput, IonModal, IonicModule } from '@ionic/angular';
import {format} from 'date-fns/format'

@Component({
  selector: 'kh-newx',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './newx.component.html',
  styleUrl: './newx.component.css'
})
export class NewxComponent {
  selectedCategory = { label: 'Grocery', icon: 'cart-outline' }

  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('expenseDate') dateEl!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    this.dateEl.nativeElement.value = format(new Date('2024-01-11'), 'yyyy-MM-dd')
  }

  onSelect(e:any) {
    console.log(e)

  }

  date = format(new Date('2024-01-11'), 'yyyy-MM-dd');
  categories = [
    {
      label: 'Bills',
      icon: 'receipt-outline',
    },
    {
      label: 'Clothes',
      icon: 'shirt-outline',
    },
    {
      label: 'Entertainment',
      icon: 'bowling-ball-outline'
    },
    {
      label: 'Food',
      icon: 'restaurant-outline'
    },
    {
      label: 'Grocery',
      icon: 'cart-outline'
    },
    {
      label: 'Health',
      icon: 'medkit-outline'
    },
    {
      label: 'Education',
      icon: 'school-outline'
    },
    {
      label: 'Snacks',
      icon: 'fast-food-outline'
    },
    {
      label: 'Transport',
      icon: 'train-outline'
    },
    {
      label: 'Toiletry',
      icon: 'cut-outline'
    },
    {
      label: 'Other',
      icon: 'ellipsis-horizontal-outline'
    },

  ]

  selecteCategory(category: any) {
    this.selectedCategory = category
    this.modal.dismiss()
  }

}
