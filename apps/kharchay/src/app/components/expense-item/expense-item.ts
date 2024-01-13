import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { mapCategory, mapSubCategory } from '../../shared/categories';
import { IExpense } from '@kh/common/api-interface';
import { IonItem, IonicModule } from '@ionic/angular';
import { DatePipe, NgIf } from '@angular/common';
import { TruncatePipe } from './truncate.pipe';
import { doc, updateDoc } from 'firebase/firestore';
import { SettingsService } from '../../services/settings.service';


@Component({
  selector: 'expense-item',
  templateUrl: './expense-item.html',
  imports: [IonicModule, NgIf, DatePipe, TruncatePipe ],
  standalone: true,
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
  @Output('onUpdate') update = new EventEmitter();


  constructor(private router: Router) { }

  ngOnInit () {
    this.item = mapCategory(this.item)
    this.item = mapSubCategory(this.item)
  }

  decideIcon(item: IExpense) {
    return typeof item.price != 'number' ? 'cloud-offline' : null
  }

  async fixPrice(item: any, more: any) {
    this.update.emit(item)
    more.close()
  }

  public showDetails(item: IExpense) {
    if (item.imageName) {
      this.router.navigate(['details'], {
        queryParams: {
          item: JSON.stringify(item)
        }
      });
    } else {
      item.details = !item.details;
      console.log(item.details)
    }
  }

  requestDeletion(event: any, more:any) {
    this.delete.emit(this.item)
    console.log(more)
    more.close()
  }
}
