import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Stepper } from '../shared/stepper';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BaseExpense } from '../home/expense-base.model';


// import { groupBy, forIn, reduce } from 'lodash';
import groupBy from 'lodash-es/groupBy';
import forIn  from 'lodash-es/forIn';
import reduce from 'lodash-es/reduce';
import startOfMonth from 'date-fns/esm/startOfMonth';
import endOfMonth from 'date-fns/esm/endOfMonth';
import { PieComponent } from './pie/pie';
import { GestureController, IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage extends Stepper implements OnInit{
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  @ViewChild('dateItem') dateItem: any;
  @ViewChild('expenseMonth', { static: true })
  expenseMonth: IonDatetime;

  chartData: number[]
  chartLabels: string[]

  month = new Date().toISOString();
  loading = true;
  total = 0;
  expRef: AngularFirestoreCollection<any>;
  expenses$: Observable<BaseExpense[]>;
  constructor(
    private afs: AngularFirestore,
    private resolver: ComponentFactoryResolver,
    private gestureCtrl: GestureController
  ) {
    super();
  }

  ngOnInit() {
    this.loadBasic();
  }

  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: this.dateItem.el,
      gestureName: 'move',
      onEnd: detail => {
        const type = detail.type;
        const currentX = detail.currentX;
        const deltaX = detail.deltaX;
        const velocityX = detail.velocityX;
        if (deltaX > 0) {
          this.addMonth(this.month, this.expenseMonth)
        } else {
          this.subMonth(this.month, this.expenseMonth)

        }

      }
    })

    gesture.enable()
  }

  loadBasic() {
    const basicStartMonth = startOfMonth(new Date(this.month));
    const basicEndMonth = endOfMonth(new Date(this.month));

    this.loading = true;
    this.expRef = this.afs.collection('expense', ref =>
      ref
        .where('date', '>=', basicStartMonth)
        .where('date', '<=', basicEndMonth)
    );

    // Finding Total
    this.expenses$ = this.expRef.valueChanges();
    this.expenses$.forEach(values => {
      this.generateDataForChart(values);
    });
  }

  generateDataForChart(values) {

    // const chartData = [];
    // const chartLabels = [];
    this.chartData = [];
    this.chartLabels = [];
    let grouped;


    // Previously for format like {category:'food'}
    // grouped = lodash.groupBy(values, ('category.title'));

    // FIXME: Replace lodash with groupBy rxjs function
    // Backward compat becuse new format is {category:{title:'food'}}
    grouped = groupBy(values, (item) => item.category.title ? item.category.title : item.category);

    forIn(grouped, (value, key, item) => {
      this.chartLabels.push(key.toUpperCase());
      this.chartData.push(reduce(
        value, (sum, n) => sum + Number(n.price), 0)
      );
    });

    // this.container.clear();
    // const factory = this.resolver.resolveComponentFactory(PieComponent);
    // const componentRef = this.container.createComponent(factory);

    // componentRef.instance.doughnutChartData = chartData;
    // componentRef.instance.doughnutChartLabels = chartLabels;
  }

}
