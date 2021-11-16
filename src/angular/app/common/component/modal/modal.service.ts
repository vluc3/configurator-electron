import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ModalEvent, ModalOptions} from "./modal.component";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalOpen = new Subject<ModalOptions<any>>();
  private modalClose = new Subject<boolean>();
  private modalEvent = new Subject<ModalEvent<any>>();

  public get modalOpen$() {
    return this.modalOpen.asObservable();
  }

  public get modalClose$() {
    return this.modalClose.asObservable();
  }

  constructor() {
  }

  open<T>(options?: ModalOptions<T>): Observable<ModalEvent<T>> {
    const subject = new Subject<ModalEvent<T>>();
    this.modalOpen.next(options);
    this.modalEvent.subscribe(value => {
      subject.next(value);
      subject.complete();
    });
    return subject.asObservable();
  }

  close(fireEvent = false){
    this.modalClose.next(fireEvent);
  }

  public send<T>(close: ModalEvent<T>): void {
    this.modalEvent.next(close);
  }
}
