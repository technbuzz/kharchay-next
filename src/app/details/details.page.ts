import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IExpense } from '../shared/expense.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { mapCategory, mapSubCategory } from '../shared/categories';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  expense: IExpense;
  loaded = false;

  constructor(private route: ActivatedRoute,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.expense = mapCategory(JSON.parse(this.route.snapshot.queryParamMap.get('item')));
    this.expense = mapSubCategory(JSON.parse(this.route.snapshot.queryParamMap.get('item')));
    this.storage.ref(`/receipts/${this.expense.imageName}`).getDownloadURL().subscribe(resp => {
      this.expense.imageUrl = resp;
      this.loaded = true;
    });
  }



}
