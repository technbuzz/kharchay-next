import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private uploadedSubject = new Subject();
  uploaded$ = this.uploadedSubject.asObservable()

  private uploadSubject = new Subject();
  upload$ = this.uploadSubject.asObservable()
  
  private cancelled = new Subject();
  cancelled$ = this.cancelled.asObservable()
  constructor() { }

  setUploaded(value) {
    this.uploadedSubject.next(value)
  }

  setUpload(value) {
    this.uploadSubject.next(value)
  }

  setCancelled(value) {
    this.cancelled.next(value)
  }
}
