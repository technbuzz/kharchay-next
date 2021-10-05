import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IExpense } from '../shared/expense.interface';
import { ref, Storage } from '@angular/fire/storage';
import { mapCategory, mapSubCategory } from '../shared/categories';
import { from } from 'rxjs';
import { traceUntilFirst } from '@angular/fire/performance';
import { getDownloadURL } from '@firebase/storage';
import { keepUnstableUntilFirst } from '@angular/fire';
import { startWith } from 'rxjs/operators';

const TRANSPARENT_PNG
  = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  expense: IExpense;
  loaded = false;

  constructor(private route: ActivatedRoute,
    private storage: Storage) { }

  ngOnInit() {
    this.expense = mapCategory(JSON.parse(this.route.snapshot.queryParamMap.get('item')));
    this.expense = mapSubCategory(JSON.parse(this.route.snapshot.queryParamMap.get('item')));
    const imgRef = ref(this.storage, `/receipts/${this.expense.imageName}`);
    from(getDownloadURL(imgRef)).pipe(
      keepUnstableUntilFirst,
      traceUntilFirst('storage'),
      startWith(TRANSPARENT_PNG)
    );
    // this.storage.ref(`/receipts/${this.expense.imageName}`).getDownloadURL().subscribe(resp => {
    //   this.expense.imageUrl = resp;
    //   this.loaded = true;
    // });
  }



}
