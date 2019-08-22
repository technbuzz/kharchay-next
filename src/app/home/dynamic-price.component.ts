import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
enum Operators {
  add = '+',
  subtract = '-'
}
@Component({
  selector: 'dynamic-price',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col size="10">
          <ion-item>
            <ion-label>Price</ion-label>
            <ion-input slot="end" required type="text" name="price" (ionBlur)="initCalculation(price)" min="0"
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
  
  initCalculation(input:any){
    if (!input) return
    const availableOperators = ['+','-']
    const operators = [];
    
    for(let i=0; i<availableOperators.length; i++){
      const o = availableOperators[i]
      if(input.includes(o)){
        operators.push(o)
      } else {
        continue
      }
    }

    if(operators.length > 1) {
      //TODO: No solution yet, hint is to use tokenization
    } else {
      const operands = input.split(operators[0])
      this.reduceCalculation(operands, operators[0])
    }
  }

  public reduceCalculation(operands:any[], operator:string) {
    // convert string to numbers
    const numberPrice = operands.map(item => {
      return parseFloat(item)
    })

    switch (operator) {
      case Operators.add:
        this.price = numberPrice.reduce((prev, item) => {
          return prev + Number(item)
        }, 0)
        break;
        
        case Operators.subtract:
          this.price = numberPrice.sort((a,b) => b-a).reduce((prev, item) => {
          return prev - Number(item)
        })
        break;
    
      default:
        break;
    }

    this.onCalculate.emit(isNaN(this.price) ? '' : this.price);
  }
  
  public calcVat() {
    const price = Number(this.price);
    const vatPercentage = price * 0.05;
    this.price = parseFloat(vatPercentage.toFixed(2)) + price

    this.onCalculate.emit(this.price);
  }



}
