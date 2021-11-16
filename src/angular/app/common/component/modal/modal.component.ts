import {ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Type, ViewChild} from '@angular/core';
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

  options?: ModalOptions<T> = {};
  private modal: any;
  private valid = false;

  constructor(
    private modalService: ModalService,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.modalService.modalOpen$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(options => {
        if (this.modal) {
          this.hide();
        }
        this.options = options;
        if (options.html) {
          this.valid = true;
        } else {
          this.valid = false;
        }

        this.modal = new bootstrap.Modal(this.modalDiv.nativeElement, {});
        this.modal.show();
      });
    this.modalService.modalClose$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((fireEvent) => {
        if (fireEvent) {
          this.cancel();
        } else {
          this.hide();
        }
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
    const data = this.options?.data;
    this.hide();
    this.modalService.send({cancel: false, data});
  }

  public cancel(): void {
    this.hide();
    this.modalService.send({cancel: true});
  }

  private hide() {
    this.modal.hide();
    delete this.modal;
    this.options = {};
    this.changeDetectorRef.detectChanges();
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
  title?: string;
  titleParams?: any,
  component?: Type<ModalBody<T>>;
  data?: T;
  html?: string;
  width?: number;
  btnText?: BtnText;
  noFooter?: boolean;
  notClosable?: boolean;
}

export interface BtnText {
  validate?: string;
  cancel?: string;
}

export interface ModalEvent<T> {
  cancel: boolean;
  data?: T;
}
