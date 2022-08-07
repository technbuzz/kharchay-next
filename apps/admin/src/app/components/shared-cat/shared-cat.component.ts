import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, ControlContainer } from '@angular/forms';
import { categories } from '../../shared/categories'


@Component({
  selector: 'shared-cat',
  templateUrl: './shared-cat.component.html',
  styleUrls: ['./shared-cat.component.scss']
})
export class SharedCatComponent implements OnInit {

  categories:any = [];
  subCategories: any = null;



  @Input() parentForm!: UntypedFormGroup;

  constructor(public controlContainer:ControlContainer) {
    Object.assign(this.categories, categories)

   }

  ngOnInit() {
  }

  populateSubCategory({ value:category }: any){
    console.log(event);
    if (category.subCategory) {
      this.subCategories = category.subCategory
      // this.form.get('subCategory').setValidators([Validators.required])
    } else {
      this.subCategories = null
      this.parentForm.get('subCategory')?.setValue('')
      // this.form.get('subCategory').setValidators([])
    }
  }

  compare(current:any, existing:any){
    return current && existing && current.title === existing.title
  }

}
