import { AfterViewChecked, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICategory, IExpense } from '@kh/common/api-interface';
import { categories } from '@kh/mobile/create/data-access';
import {formatISO} from 'date-fns/formatISO';

@Component({
  selector: 'kh-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements AfterViewInit, OnInit {
  // @Input() set item(value: IExpense) {
  //   console.log(value)
  //   this.patchForm(this.parent, value)
  // }
  @Input() item!: IExpense;


  @Input() price = ''
  @Input() parent!: FormGroup;
  form = this.fb.group({
    price: ['', Validators.required],
    date: [formatISO(new Date()), Validators.required],
    category: ['', Validators.required],
    subCategory: null,
    note: ['', Validators.required],
    imageName: '',
    fixed: null
  })

  maxDate = formatISO(new Date());
  categories: any[] = [];
  showSubCategory = false;
  selectedSubCategory!: '';
  subCategories!: ICategory[];

  constructor(private fb: FormBuilder) {
    Object.assign(this.categories, categories);
  }
  ngAfterViewInit(): void {
    this.patchForm(this.parent, this.item)
  }

  ngOnInit() {
    this.parent.addControl('price', new FormControl('', Validators.required))
    this.parent.addControl('date', new FormControl(formatISO(new Date()), Validators.required))
    this.parent.addControl('category', new FormControl('', Validators.required))
    this.parent.addControl('subCategory', new FormControl(''))
    this.parent.addControl('note', new FormControl('', Validators.required))
    this.parent.addControl('imageName', new FormControl(''))
    this.parent.addControl('fixed', new FormControl(''))
  }



  private patchForm(form:FormGroup, value: IExpense) {
    console.log(value)
    form.patchValue({
      price: value.price,
      date: formatISO(value.date),
      category: this.categories.find(c => c.title = value.category.title),
      subCategory: value.subCategory,
      note: value.note
    })
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
