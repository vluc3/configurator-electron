import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Host} from "../../../../common/model/host";
import {ModalService} from "../../../../common/component/modal/modal.service";

@Component({
  selector: 'div[hostListItem]',
  templateUrl: './host-list-item.component.html',
  styleUrls: ['./host-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HostListItemComponent implements OnInit {

  @HostBinding('class') clazz = 'host-list-item';

  @Input() host: Host;
  @Output() onDelete = new EventEmitter<Host>();

  constructor(
    private modalService: ModalService
  ) {
  }

  ngOnInit(): void {
  }

  delete() {
    this.modalService.open({
      title: 'HOST_REMOVAL',
      html: `<p class="text-danger">{{ 'HOST_REMOVAL_QUESTION' | translate }}</p>`,
    }).subscribe(close => {
      if (!close.cancel) {
        this.onDelete.emit(this.host);
      }
    });
  }

}
