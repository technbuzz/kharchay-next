import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IExpense } from '../../shared/expense.interface';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { mapCategory, mapSubCategory } from '../../shared/categories';


@Component({
  selector: 'expense-item',
  template: `
    <ion-item-sliding [disabled]="!item.id">
      <ion-item class="ion-no-padding" [attr.detail]="item.imageName" (click)="showDetails(item)">
        <ion-avatar slot="start" *ngIf="item.imageName">
          <img src="./assets/imgs/placeholder.png">
        </ion-avatar>

        <section class="inner-piece" [className]="item.details ? null : 'ion-text-nowrap'">
          <small>{{item.date | date:"MMM d"}}</small>

          <div>
            <ion-badge color="light" *ngIf="item.category">{{item.category.title}}</ion-badge>
            <ion-badge color="light" *ngIf="item?.subCategory">{{item?.subCategory.title}}</ion-badge>
          </div>
          <p class="ion-no-margin">{{item.note}}</p>
        </section>

        <h3 slot="end">{{item.price}}</h3>

      </ion-item>

      <ion-item-options slide="start" *ngIf="!readonly" >
        <ion-item-option color="danger" (click)="delete.emit(item)">Delete</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  `,
  styles: [
    `
      small {
        line-height: 2
      }
      ion-badge{
        margin-right: 5px;
        font-weight: normal;
      }
      ion-item{
        --inner-padding-top: 0.35rem;
        --inner-padding-bottom: 0.35rem;
      }
    `
  ]
})
export class ExpenseItemComponent implements OnInit {
  @Input('expense') item: IExpense;
  @Input() readonly = false;
  @Output('onDelete') delete = new EventEmitter();

  constructor(private navCtrl: NavController, private router: Router) {
  }

  ngOnInit () {
    this.item = mapCategory(this.item)
    this.item = mapSubCategory(this.item)

  }

  public showDetails(item: IExpense) {
    if (item.imageName) {
      this.router.navigate(['details'], {
        queryParams: {
          item: JSON.stringify(item)
        }
      });
      // this.navCtrl.push('DetailsPage', { item });
    } else {
      item.details = !item.details;
    }
  }
}
