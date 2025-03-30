import { DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { IonCol, IonButton, IonDatetimeButton, IonModal, IonGrid, IonIcon, IonRow, IonPopover, IonContent, IonNote, IonDatetime} from '@ionic/angular/standalone';
import { DatetimeCustomEvent } from '@ionic/core';
import { Category, categories } from '@models';
import { addIcons } from "ionicons";
import {cutOutline, trainOutline, shirtOutline, bowlingBallOutline, restaurantOutline, receiptOutline, cartOutline, fastFoodOutline, schoolOutline, medkitOutline, ellipsisHorizontalOutline, cashOutline, duplicate  } from "ionicons/icons";
import { DecideIconDirective } from './decideIconDirective';

@Component({
  selector: 'kh-newx',
  standalone: true,
  imports: [IonDatetimeButton, JsonPipe, IonDatetime, DecideIconDirective, IonButton, IonModal, IonContent, IonNote, IonGrid, IonRow, IonCol, IonIcon, DatePipe, IonPopover, TitleCasePipe, ReactiveFormsModule],
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

  fieldSizing = CSS.supports('field-sizing', 'content') ? 'auto' : '4'

  constructor() {
    addIcons({cutOutline, trainOutline, shirtOutline, bowlingBallOutline, restaurantOutline, receiptOutline, cartOutline, fastFoodOutline, schoolOutline, medkitOutline, ellipsisHorizontalOutline, cashOutline, duplicate  });
  }

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
