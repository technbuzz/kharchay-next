import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonSearchbar, IonContent } from "@ionic/angular/standalone";

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
    standalone: true,
    imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonSearchbar, IonContent],
})
export class SearchPage implements OnInit {

    loader: any;

    constructor(
    ) { }

    ngOnInit() {
    }


    getItems() {

    }


}
