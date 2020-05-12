import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  private event = new Subject<any>();

  publishData(data: any) {
    this.event.next(data);
  }

  getObservable(): Subject<any> {
    return this.event;
  }
}
