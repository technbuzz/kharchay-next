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

  setUploaded(value:any) {
    this.uploadedSubject.next(value)
  }

  setUpload(value:any) {
    this.uploadSubject.next(value)
  }

  setCancelled(value:any) {
    this.cancelled.next(value)
  }
}
