import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { IExpense } from '@models'
import { OverlayEventDetail } from '@ionic/core';
import { FormGroup } from '@angular/forms';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent } from "@ionic/angular/standalone";

export interface RecurringEvent {
    item: IExpense,
    documentToBeDeletedID: string
}

@Component({
    selector: 'kh-recurring',
    templateUrl: './recurring.component.html',
    styleUrls: ['./recurring.component.scss'],
    standalone: true,
    imports: [IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent],
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

        if (item.fixed) {
            this.confirmExpense.emit({ item, documentToBeDeletedID: item.id as string })
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
            this.confirmExpense.emit({ item: this.form.value as IExpense, documentToBeDeletedID: this.selectedItem.id as string })
        }
        this.isModelOpen = false
    }
}
