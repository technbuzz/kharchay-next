import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
    standalone: true,
    imports: [IonicModule],
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
