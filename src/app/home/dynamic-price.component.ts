import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dynamic-price',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col size="10">
          <ion-item>
            <ion-label>Pricezz</ion-label>
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

    this.onCalculate.emit(this.price);
  }
  
  public calcVat() {
    const price = Number(this.price);
    const vatPercentage = price * 0.05;
    this.price = parseFloat(vatPercentage.toFixed(2)) + price

    this.onCalculate.emit(this.price);
  }

}
