import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Host} from "../../../../common/model/host";
import {ModalService} from "../../../../common/component/modal/modal.service";
import {NewHostComponent} from "../new-host/new-host.component";
import {clone, copyEntries} from "../../../../common/utils/utils";
import {TranslateService} from "@ngx-translate/core";
import {StateService} from "../../../../common/service/state.service";

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
    private modalService: ModalService,
    private translateService: TranslateService,
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
  }

  edit() {
    this.modalService.open<Host>({
      title: "EDIT_HOST",
      component: NewHostComponent,
      data: clone(this.host)
    }).subscribe(close => {
      if (!close.cancel && close.data) {
        copyEntries(this.host, close.data);
        this.stateService.save();
      }
    });
  }

  delete() {
    this.modalService.open({
      title: 'HOST_REMOVAL',
      html: `<p class="text-danger">${this.translateService.instant("INFRASTRUCTURE.HOST.HOST_REMOVAL_QUESTION")}</p>`,
    }).subscribe(close => {
      if (!close.cancel) {
        this.onDelete.emit(this.host);
      }
    });
  }
}
