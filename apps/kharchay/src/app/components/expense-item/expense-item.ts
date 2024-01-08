import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { mapCategory, mapSubCategory } from '../../shared/categories';
import { IExpense } from '@kh/common/api-interface';


@Component({
  selector: 'expense-item',
  templateUrl: './expense-item.html',
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
  @Input('expense') item!: IExpense;
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
