import { DatePipe } from '@angular/common';
import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { IonGrid, IonInput, IonModal, IonicModule } from '@ionic/angular';
import {format} from 'date-fns/format'
import { Category, categories } from './categories';


@Component({
  selector: 'kh-newx',
  standalone: true,
  imports: [IonicModule,DatePipe, ReactiveFormsModule],
  templateUrl: './newx.component.html',
  styleUrl: './newx.component.css'
})
export class NewxComponent {
  selectedCategory: Category = { title: 'Grocery', icon: 'cart-outline' }

  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('submodal') submodal!: IonModal;
  @ViewChild('expenseDate') dateEl!: ElementRef<HTMLInputElement>;

  @Input() parent!: UntypedFormGroup;
  @Output() onSubmit = new EventEmitter()

  parentCategory!: Category

  ngAfterViewInit() {
    this.dateEl.nativeElement.value = format(new Date('2024-01-11'), 'yyyy-MM-dd')
  }

  categories = categories

  onSelect(e:any) {

    console.log(e)

  }

  date = format(new Date('2024-01-11'), 'yyyy-MM-dd');

  selecteCategory(category: Category) {
      this.selectedCategory = category
      this.parent.controls['category'].setValue({ title: category.title })
      this.modal.dismiss()

      if(category.categories) {
        this.submodal.present()
      } else {
        this.parent.controls['subCategory'].reset()
      }

      console.log(this.parent.value)


  }


  selectSubCategory(category: Category) {
    this.parent.controls['subCategory'].setValue({ title: category.title })
      console.log(this.parent.value)
    this.submodal.dismiss()
  }
}
