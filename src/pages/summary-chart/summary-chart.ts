import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Expense } from '../home/expense.model';
import { startOfMonth, endOfMonth } from 'date-fns';
import * as lodash from 'lodash';
import { PieComponent } from '../../components/pie/pie';

@IonicPage()
@Component({
  selector: 'page-summary-chart',
  templateUrl: 'summary-chart.html'
})
export class SummaryChartPage {
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
  loading: boolean = true;
  month = '';
  expRef: AngularFirestoreCollection<any>;
  expenses$: Observable<Expense[]>;

  doughnutChartLabels = [];
  doughnutChartData = []

  total: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private resolver: ComponentFactoryResolver
  ) {
  }
  
  ionViewDidLoad() {
    this.getCurrentMonthStats();
  }

  getCurrentMonthStats() {
    const basicStartMonth = startOfMonth(new Date());
    const basicEndMonth = endOfMonth(new Date());

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
    this.loading = false;
  }

  loadBasic(){
    //TODO: Merge this function with getCurrentMonthStats
    const basicStartMonth = startOfMonth(this.month);
    const basicEndMonth = endOfMonth(this.month);

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
   
    let chartData = []
    let chartLabels = [];

    const grouped = lodash.groupBy(values, 'category');
    lodash.forIn(grouped, (value, key, item) => {
      chartLabels.push(key.toUpperCase());
      chartData.push(lodash.reduce(
          value,(sum, n) => {
            return sum + Number(n.price);
          },0))
      console.log(key);
      
    });

    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(PieComponent);
    const componentRef = this.container.createComponent(factory);
    componentRef.instance.doughnutChartData = chartData;
    componentRef.instance.doughnutChartLabels = chartLabels;
  }
}
