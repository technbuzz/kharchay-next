import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewComponent } from './new/new.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule.forRoot()],
  declarations: [NewComponent],
  exports: [NewComponent],
})
export class SharedUiNewModule {}
