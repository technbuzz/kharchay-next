import { Component, OnInit } from '@angular/core';
import { of, timer, Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  loader: any;

  constructor(
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.presentLoading()
  }

  async presentLoading () {
    this.loader = await this.loadingCtrl.create({
      message: 'Uploading Image, Please wait...',
      spinner: 'dots'
    });
    await this.loader.present();
  }

  getItems() {

  }


}
