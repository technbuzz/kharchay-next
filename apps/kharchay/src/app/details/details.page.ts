import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ref, Storage } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { traceUntilFirst } from '@angular/fire/performance';
import { getDownloadURL } from 'firebase/storage';
import { keepUnstableUntilFirst } from '@angular/fire';
import { startWith, tap } from 'rxjs/operators';
import { IExpense, mapCategory, mapSubCategory } from '@kh/common/api-interface';
import { NgIf, AsyncPipe } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonSpinner, IonCard, IonCardContent, IonCardTitle, IonBadge } from "@ionic/angular/standalone";

const TRANSPARENT_PNG
    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

@Component({
    selector: 'kh-details',
    templateUrl: './details.page.html',
    styleUrls: ['./details.page.scss'],
    standalone: true,
    imports: [
        NgIf,
        AsyncPipe,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonSpinner,
        IonCard,
        IonCardContent,
        IonCardTitle,
        IonBadge
    ],
})
export class DetailsPage implements OnInit {

    expense!: IExpense;
    loaded = false;

    imgUrl$!: Observable<any>;

    constructor(private route: ActivatedRoute,
        private storage: Storage) { }

    ngOnInit() {
        let item;
        if (this.route.snapshot.queryParamMap.get('item')) {
            item = this.route.snapshot.queryParamMap.get('item') as string;
            this.expense = mapCategory(JSON.parse(item));
            this.expense = mapSubCategory(JSON.parse(item));
            const imgRef = ref(this.storage, `/receipts/${this.expense.imageName}`);
            this.imgUrl$ = from(getDownloadURL(imgRef)).pipe(
                keepUnstableUntilFirst,
                traceUntilFirst('storage'),
                // startWith(TRANSPARENT_PNG),
                startWith("./assets/imgs/placeholder.jpg")
            )
        }
    }



}
