import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ModalClose, ModalOptions} from "./modal.component";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalOpen = new Subject<ModalOptions<any>>();
  private modalClose = new Subject<ModalClose<any>>();

  public get modalOpen$() {
    return this.modalOpen.asObservable();
  }

  constructor() {
  }

  open<T>(options?: ModalOptions<T>): Observable<ModalClose<T>> {
    const subject = new Subject<ModalClose<T>>();
    this.modalOpen.next(options);
    this.modalClose.subscribe(value => {
      subject.next(value);
      subject.complete();
    });
    return subject.asObservable();
  }

  public close<T>(close: ModalClose<T>): void {
    this.modalClose.next(close);
  }
}
