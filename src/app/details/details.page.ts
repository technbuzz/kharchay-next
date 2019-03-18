import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IExpense } from '../shared/expense.interface';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  expense: IExpense;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.expense = JSON.parse(this.route.snapshot.queryParamMap.get('item'))
    
  }

}
