import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { IonicModule } from "@ionic/angular";

import { CreateComponent } from './create/create.component';
import { DynamicPriceModule, InvoiceModule, NewComponentModule } from "@kh/mobile/create/ui";

export const routes: Route[] = [
  {
    path: '',
    component: CreateComponent
  }
];

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    IonicModule, 
    DynamicPriceModule,
    NewComponentModule,
    InvoiceModule
  ],
  declarations: [CreateComponent],
})
export class MobileCreateFeatureModule { }
