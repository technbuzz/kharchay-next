import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ICategory } from '@kh/common/api-interface';
import { categories } from '@kh/mobile/create/data-access';
import {formatISO} from 'date-fns/formatISO';

@Component({
  selector: 'kh-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent {

  @Input() price = ''
  @Input() parent!: UntypedFormGroup;

  maxDate = formatISO(new Date());
  categories: any[] = [];
  showSubCategory = false;
  recurringLoading = false;
  selectedSubCategory!: '';
  subCategories!: ICategory[];

  constructor(private fb: UntypedFormBuilder) {
    Object.assign(this.categories, categories);
  }

  populateSubCategory(event: any) {
    const { detail: { value: category } } = event
    if (category.subCategory && category.subCategory) {
      this.subCategories = category.subCategory;
      this.showSubCategory = true;
    } else {
      this.showSubCategory = false;
    }
  }



}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule.forRoot()],
  declarations: [NewComponent],
  exports: [NewComponent],
})
export class NewComponentModule { }
