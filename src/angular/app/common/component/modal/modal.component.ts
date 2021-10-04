import {Component, ElementRef, EventEmitter, OnInit, Type, ViewChild} from '@angular/core';
import {ModalService} from "./modal.service";
import {SubscriberComponent} from "../../abstract/subscriber.component";
import {takeUntil} from "rxjs/operators";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'div[modal]',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent<T> extends SubscriberComponent implements OnInit {

  @ViewChild('modal') modalDiv?: ElementRef<HTMLDivElement>;

  options?: ModalOptions<T>;
  private modal: any;
  private valid = false;

  constructor(
    private modalService: ModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.modalService.modalOpen$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(options => {
        this.options = options;
        if (options.html) {
          this.valid = true;
        }
        // @ts-ignore
        this.modal = new bootstrap.Modal(this.modalDiv.nativeElement, {});
        this.modal.show();
      });
  }

  public sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public validate(): void {
    if (!this.valid) {
      this.modal._triggerBackdropTransition();
      return;
    }
    this.modal.hide();
    this.modalService.close({cancel: false, data: this.options?.data});
    delete this.options;
  }

  public cancel(): void {
    this.modal.hide();
    this.modalService.close({cancel: true});
    delete this.options;
  }

  dataValidate(event: { valid: boolean, data?: T }) {
    if (event.valid && event.data && this.options) {
      this.options.data = event.data;
    }
    this.valid = event.valid;
  }
}

export interface ModalBody<T> {
  data?: T;
  dataValidate?: EventEmitter<{
    valid: boolean,
    data?: T
  }>;
}

export interface ModalOptions<T> {
  title: string;
  component?: Type<ModalBody<T>>;
  data?: T;
  html?: string;
  width?: number;
}

export interface ModalClose<T> {
  cancel: boolean;
  data?: T;
}
