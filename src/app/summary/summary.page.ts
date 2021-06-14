import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Stepper } from '../shared/stepper';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BaseExpense } from '../home/expense-base.model';


import { groupBy, forIn, reduce } from 'lodash';
// import { group  } from 'lodash-es';
import { startOfMonth, endOfMonth } from 'date-fns';
import { PieComponent } from '../components/pie/pie';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage extends Stepper implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;

  month = new Date().toISOString();
  loading = true;
  total = 0;
  expRef: AngularFirestoreCollection<any>;
  expenses$: Observable<BaseExpense[]>;
  constructor(
    private afs: AngularFirestore,
    private resolver: ComponentFactoryResolver
  ) {
    super();
  }

  ngOnInit() {
    this.loadBasic();
  }

  loadBasic() {
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

    const chartData = [];
    const chartLabels = [];
    let grouped;
    console.log({ values });

    // Previously for format like {category:'food'}
    // grouped = lodash.groupBy(values, ('category.title'));

    // FIXME: Replace lodash with groupBy rxjs function
    // Backward compat becuse new format is {category:{title:'food'}}
    grouped = groupBy(values, (item) => item.category.title ? item.category.title : item.category);
    console.log({ grouped });

    forIn(grouped, (value, key, item) => {
      chartLabels.push(key.toUpperCase());
      chartData.push(reduce(
        value, (sum, n) => sum + Number(n.price), 0));
    });

    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(PieComponent);
    const componentRef = this.container.createComponent(factory);

    console.log(chartLabels);


    componentRef.instance.doughnutChartData = chartData;
    componentRef.instance.doughnutChartLabels = chartLabels;
    // componentRef.instance.chartClicked.subscribe((event, item) => {
    //   console.log(event);
    //   console.log(item);

    // })
  }

}
