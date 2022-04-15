import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IExpense } from '../shared/expense.interface';
import { ref, Storage } from '@angular/fire/storage';
import { mapCategory, mapSubCategory } from '../shared/categories';
import { from, Observable } from 'rxjs';
import { traceUntilFirst } from '@angular/fire/performance';
import { getDownloadURL } from '@firebase/storage';
import { keepUnstableUntilFirst } from '@angular/fire';
import { startWith, tap } from 'rxjs/operators';

const TRANSPARENT_PNG
  = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  expense!: IExpense;
  loaded = false;

  imgUrl$!: Observable<any>;

  constructor(private route: ActivatedRoute,
    private storage: Storage) { }

  ngOnInit() {
    let item;
    if(this.route.snapshot.queryParamMap.get('item')) {
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
