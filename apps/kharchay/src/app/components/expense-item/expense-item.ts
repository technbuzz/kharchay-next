import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IExpense, mapCategory, mapSubCategory } from '@models';
import { TruncatePipe } from './truncate.pipe';
import { IonItemSliding, IonItem, IonAvatar, IonLabel, IonGrid, IonRow, IonCol, IonIcon, IonBadge, IonNote, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";

@Component({
    selector: 'expense-item',
    templateUrl: './expense-item.html',
    imports: [NgIf, DatePipe, TruncatePipe, IonItemSliding, IonItem, IonAvatar, IonLabel, IonGrid, IonRow, IonCol, IonIcon, IonBadge, IonNote, IonItemOptions, IonItemOption],
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
    private router = inject(Router);

    @Input('expense') item!: IExpense;

    @Input() readonly = false;
    @Output('onDelete') delete = new EventEmitter();
    @Output('onUpdate') update = new EventEmitter();

    ngOnInit() {
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

    requestDeletion(event: any, more: any) {
        this.delete.emit(this.item)
        console.log(more)
        more.close()
    }
}
