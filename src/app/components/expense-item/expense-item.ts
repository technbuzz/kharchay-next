import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IExpense } from '../../shared/expense.interface';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'expense-item',
  template: `
    <ion-item-sliding [disabled]="!item.id">
      <ion-item no-padding [attr.detail]="item.imageName" (click)="showDetails(item)">
        <ion-avatar slot="start" *ngIf="item.imageUrl">
          <img src="./assets/imgs/placeholder.png">
        </ion-avatar>

        <section class="inner-piece" [className]="item.details ? null : 'ion-text-nowrap'">
          <h5>{{item.price}}</h5>
          <div>
            <!-- For backward compatibility -->
            <ion-badge *ngIf="item.category.title else oldTitle">{{item.category.title}}</ion-badge>
            <ng-template #oldTitle>
              <ion-badge>{{item.category}}</ion-badge>
            </ng-template>
            <!-- END For backward compatibility -->
  
            <ion-badge *ngIf="item?.subCategory" color="danger">{{item?.subCategory}}</ion-badge>
          </div>
          <p class="ion-no-margin">{{item.note}}</p>
        </section>

        <p slot="end">{{item.date | date:"E, MMM d, y"}}</p>
      </ion-item>

      <ion-item-options slide="start" *ngIf="!readonly" >
        <ion-item-option color="danger" (click)="delete.emit(item)">Delete</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  `
})
export class ExpenseItemComponent{
  @Input('expense') item: IExpense;
  @Input() readonly: boolean = false;
  @Output('onDelete') delete = new EventEmitter();

  constructor(private navCtrl: NavController,private router: Router) {
  }
  
  public showDetails(item: IExpense) {
    if (item.imageName) {
      this.router.navigate(['details'], {
        queryParams: {
          item: JSON.stringify(item)
        }
      })
      // this.navCtrl.push('DetailsPage', { item });
    } else {
      item.details = !item.details;
    }
  }
}
