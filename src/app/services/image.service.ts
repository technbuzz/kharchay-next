import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  uploadedSubject = new Subject();
  uploaded$: Observable<any> = this.uploadedSubject.asObservable()
  constructor() { }

  setUploaded(value) {
    this.uploadedSubject.next(value)
  }
}
