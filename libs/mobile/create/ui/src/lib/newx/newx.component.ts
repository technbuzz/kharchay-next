import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { DatetimeCustomEvent } from '@ionic/core';
import { Category, categories } from './categories';

@Component({
  selector: 'kh-newx',
  standalone: true,
  imports: [IonicModule, DatePipe, TitleCasePipe, ReactiveFormsModule],
  templateUrl: './newx.component.html',
  styleUrl: './newx.component.css'
})
export class NewxComponent {
  selectedCategory: Category = { title: 'Grocery', icon: 'cart-outline' }

  selectedSubCategory: Category | undefined

  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('submodal') submodal!: IonModal;

  @Input() parent!: UntypedFormGroup;
  @Output() onSubmit = new EventEmitter()

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputEl.nativeElement.focus()
    }) ;
  }

  categories = categories

  onSelect(event: Event) {
    const value = (event as DatetimeCustomEvent).detail.value
    this.parent.controls['date'].setValue(value)
  }

  selecteCategory(category: Category) {
      this.selectedCategory = category
      this.parent.controls['category'].setValue({ title: category.title })
      this.modal.dismiss()
  }

  categoryDismissed() {
    this.selectedSubCategory = undefined
    if(this.selectedCategory.categories) {
      this.submodal.present()
    } else {
      this.parent.controls['subCategory'].reset()
    }
    console.log(this.parent.value)
    console.log(this.selectedCategory)
  }


  selectSubCategory(category: Category) {
    this.parent.controls['subCategory'].setValue({ title: category.title })
    this.selectedSubCategory = category
    console.log(this.parent.value)
    this.submodal.dismiss()
  }
}
