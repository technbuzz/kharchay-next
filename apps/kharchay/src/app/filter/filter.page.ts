import { Component, OnInit, ViewChild, inject, input } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { collection, collectionData, collectionGroup, deleteDoc, doc, Firestore, getAggregateFromServer, getDocs, orderBy, sum, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { IonNote, SegmentChangeEventDetail } from '@ionic/angular/standalone';
import { endOfMonth } from 'date-fns/endOfMonth';
import { isBefore } from 'date-fns/isBefore';
import { startOfMonth } from 'date-fns/startOfMonth';
import { lightFormat } from 'date-fns/lightFormat';
import { parseISO } from 'date-fns/parseISO';
import { parse } from 'date-fns/parse';

import { Observable, map } from 'rxjs';
import { BaseExpense } from '../home/expense-base.model';
import { categories } from '../shared/categories';
import { Stepper } from '../shared/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { IExpense } from '@kh/common/api-interface';
import { SettingsService } from '../services/settings.service';
import { ExpenseItemComponent } from '../components/expense-item/expense-item';
import { NgSwitch, NgSwitchCase, NgFor, AsyncPipe, DecimalPipe, TitleCasePipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { addIcons } from "ionicons";
import { calendar, pieChart } from "ionicons/icons";
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonSegment, IonSegmentButton, IonList, IonItem, IonLabel, IonButton, IonIcon, IonPopover, IonDatetime, IonSelect, IonSelectOption, IonFab, IonFabButton } from "@ionic/angular/standalone";
import { format } from 'date-fns/format';

@Component({
    selector: 'kh-filter',
    templateUrl: './filter.page.html',
    styleUrls: ['./filter.page.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        NgSwitch,
        NgSwitchCase,
        NgFor,
        ExpenseItemComponent,
        AsyncPipe,
        DecimalPipe,
        TitleCasePipe,
        DatePipe,
        IonContent,
        IonSegment,
        IonSegmentButton,
        IonList,
        IonItem,
        IonLabel,
        IonButton,
        IonIcon,
        IonPopover,
        IonDatetime,
        IonSelect,
        IonSelectOption,
        IonFab,
        IonFabButton,
        IonNote
    ],
})
export class FilterPage extends Stepper implements OnInit {

    @ViewChild(IonDatetime, { static: true }) datetime!: IonDatetime;
    month = input<string>(format(new Date(), 'yyyy-MM'));

    settingService = inject(SettingsService)
    $configs = toSignal(this.settingService.getConfig())
    categories: any = [];

    searchType = 'basic';
    filter = {
        startDate: '',
        endDate: '',
        category: '',
        month: new Date().toISOString()
    };

    expenses$!: Observable<BaseExpense[]>;
    expRef: any;
    total = 0;


    constructor(private router: Router, private afs: Firestore) {
        super();
        Object.assign(this.categories, categories);
        addIcons({ calendar, pieChart });
    }

    ngOnInit() {
        const date = this.month()
        if (date) {
            this.filter.month = parse(date, 'yyyy-MM', new Date()).toISOString()
        }
        this.loadBasic();
    }

    async fixPrice() {
        const batcher = writeBatch(this.afs)

        const basicStartMonth = startOfMonth(new Date(this.filter.month));
        const basicEndMonth = endOfMonth(new Date(this.filter.month));
        const expenseGroup = collection(this.afs, 'expense')
        const expenseQuery = query(
            expenseGroup,
            where('date', '>=', basicStartMonth),
            where('date', '<=', basicEndMonth),
        )

        // const resp = await deleteDoc(doc(this.afs, `expense/${item.id}`))
        collectionData(expenseQuery, { idField: 'id' }).subscribe(expense => {
            expense.forEach(item => {
                console.log(item)
                batcher.update(doc(this.afs, `expense/${item.id}`), {
                    price: Number(item['price'])
                })
            })

        })


        const resp = await batcher.commit()
        console.log('batch updated', resp)

    }

    onSegmentChange(event: any) {
        this.searchType = event.detail.value
    }

    public loadBasic() {
        const basicStartMonth = startOfMonth(new Date(this.filter.month));
        const basicEndMonth = endOfMonth(new Date(this.filter.month));

        this.loadResults({ startDate: basicStartMonth.toISOString(), endDate: basicEndMonth.toISOString() });

        const ref = collection(this.afs, 'expense');
        this.expRef = query(ref,
            where('date', '>=', basicStartMonth),
            where('date', '<=', basicEndMonth)
        );


        // Finding Total
        this.findTotal();
        // this.findTest()
    }

    async fixPriceItem(item: IExpense) {
        const resp = await updateDoc(doc(this.afs, `expense/${item.id}`), {
            price: Number(item.price)
        })

        console.log('updated', resp)


    }

    public loadResults(event: any) {
        // Remove following lines after tesing
        if (event && event.startDate && event.endDate) {
            this.filter.startDate = event.startDate;
            this.filter.endDate = event.endDate;
        }

        if (!this.filter.startDate || !this.filter.endDate || !this.filter.category) {
            return;
        }

        if (isBefore(new Date(this.filter.endDate), new Date(this.filter.startDate))) {
            // this.toastCtrl.create({
            //   message: 'Note: Start Date cannot be set in the future.',
            //   position: 'bottom',
            //   showCloseButton: true
            // }).present();

            return;
        }

        const ref = collection(this.afs, 'expense');
        this.expRef = query(ref,
            where('date', '>=', new Date(this.filter.startDate)),
            where('date', '<=', new Date(this.filter.endDate)),
            where('category', '==', this.filter.category),
            orderBy('date', 'desc')
        );
        this.findTotal();
    }

    async findTest() {
        const querySnapshot = await getDocs(this.expRef);
        console.log(querySnapshot)
        querySnapshot.forEach((doc) => {

            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });

    }

    async findTotal() {
        const snapshot = await getAggregateFromServer(this.expRef, {
            total: sum('price')
        })

        this.total = snapshot.data().total
        this.expenses$ = collectionData(this.expRef, { idField: 'id' })
    }

    async deleteExpense(item: IExpense) {
        if (this.$configs()?.deleteRights) {
            const resp = await deleteDoc(doc(this.afs, `expense/${item.id}`))
            console.log(item.id, resp, 'deleted')
        } else {
            console.log('No Delete rights')
        }
    }

    navigateToGraph() {
        const selectedMonth =  lightFormat(parseISO(this.filter.month), 'yyyy-MM')
        this.router.navigate(["/summary"], { queryParams: { month: selectedMonth } } )
    }

}
