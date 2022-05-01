import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { GeneralService } from './general.service';

@Injectable({ providedIn: 'root' })
export class TitleResolver implements Resolve<any> {
  constructor(private title: Title, private gs: GeneralService){}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const newTitle = route.data['title']
    this.title.setTitle(newTitle)
    this.gs.title.next(newTitle);
    return ;
  }
}