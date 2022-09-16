import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { IonModal } from '@ionic/angular'
import { IExpense } from '@kh/common/api-interface'
import { OverlayEventDetail } from '@ionic/core/components';
import { FormGroup } from '@angular/forms';

export interface RecurringEvent {
  item: IExpense,
  documentToBeDeletedID: string
}

@Component({
  selector: 'kh-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss'],
})
export class RecurringComponent {

  @Input() loading = false
  @Input() expenses!: IExpense[]
  @Output() confirmExpense = new EventEmitter<RecurringEvent>()
  @ViewChild(IonModal) modal!: IonModal;

  selectedItem !: IExpense;
  form = new FormGroup({});
  isModelOpen = false;


  submit(item: IExpense) {
    if (this.loading) {
      return
    }

    if(item.fixed) {
      this.confirmExpense.emit({ item, documentToBeDeletedID: item.id as string})
    } else {
      this.selectedItem = item
      this.isModelOpen = true
    }
  }


  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss('confirm name', 'confirm');
  }
  
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.confirmExpense.emit({ item: this.form.value as IExpense, documentToBeDeletedID: this.selectedItem.id as string})
    }
    this.isModelOpen = false
  }
}
