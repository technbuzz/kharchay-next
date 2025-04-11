import { Component, computed, effect, input, OnInit } from '@angular/core';
import { categories, IExpense } from '@models';
import { ExpenseItemComponent } from '../expense-item/expense-item';
import { IonAccordion, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonNote, IonRow } from '@ionic/angular/standalone';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { DecideIconDirective } from '../../shared/create/newx/decideIconDirective';
import { addIcons } from 'ionicons';
import {cutOutline, trainOutline, shirtOutline, bowlingBallOutline, restaurantOutline, receiptOutline, cartOutline, fastFoodOutline, schoolOutline, medkitOutline, ellipsisHorizontalOutline, cashOutline, duplicate  } from "ionicons/icons";

@Component({
  selector: 'expense-group',
  imports: [ExpenseItemComponent, IonItem, IonIcon, IonNote, IonAccordion, CurrencyPipe, IonGrid, IonRow, IonCol, IonLabel, TitleCasePipe, DecideIconDirective],
  templateUrl: './expense-group.html',
  styleUrls: ['./expense-group.css'],
})
export class ExpenseGroup {

  group = input.required<{ key: string; value: IExpense[] | undefined }>()

  $total = computed(() => {
    return this.group().value?.reduce((a, b: any) => Number(a) + Number(b.price), 0)
  })

  $group = computed(() => {
    return categories.find(c => c.title === this.group().key)
  })

  #iconeffect = effect(() => {
    console.log(this.$group())
  })


  constructor() {
    addIcons({cutOutline, trainOutline, shirtOutline, bowlingBallOutline, restaurantOutline, receiptOutline, cartOutline, fastFoodOutline, schoolOutline, medkitOutline, ellipsisHorizontalOutline, cashOutline, duplicate  });
  }
}
