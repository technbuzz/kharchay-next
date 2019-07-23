import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dynamic-price',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col size="10">
          <ion-item>
            <ion-label>Price</ion-label>
            <ion-input slot="end" required type="text" name="price" (ionBlur)="calculate()" min="0"
              [(ngModel)]="price">
            </ion-input>
          </ion-item>
        </ion-col>
        <ion-col>
          <ion-button margin-top-small size="small" color="light" (click)="calcVat()">Vat</ion-button>
        </ion-col>
      </ion-row>
  </ion-grid>
  `,
  styles: [''],
})
export class DynamicPriceComponent implements OnInit {

  @Input('price') price: number;
  @Output() onCalculate = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  
  advCalculate(input){
    const str = '2+2+2'
  const availableOperators = ['+','-']
  const operators = [];
  // operators.map(o => {
  //   input.includes(0)
  // })
  
  for(let i=0; i<availableOperators.length; i++){
    const o = availableOperators[i]
    if(input.includes(o)){
      operators.push(o)
    } else {
      continue
    }
  }

  return operators
  // if(!input.includes('-')){
  //   return input.toString().split('+')
  // }
}

  public calculate() {
    if (!this.price) return

    const price = this.price.toString().split('+')
    // convert string to numbers
    const numberPrice = price.map(item => {
      return parseFloat(item)
    })

    // calculate prices
    this.price = numberPrice.reduce((prev, item) => {
      return prev + Number(item)
    }, 0)

    this.onCalculate.emit(isNaN(this.price) ? '' : this.price);
  }
  
  public calcVat() {
    const price = Number(this.price);
    const vatPercentage = price * 0.05;
    this.price = parseFloat(vatPercentage.toFixed(2)) + price

    this.onCalculate.emit(this.price);
  }



}
