import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Service} from "../../../../common/model/service";
import {ModalService} from "../../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'div[virtualMachineItemService]',
  templateUrl: './virtual-machine-item-service.component.html',
  styleUrls: ['./virtual-machine-item-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VirtualMachineItemServiceComponent implements OnInit {

  @HostBinding('class') clazz = 'virtual-machine-item-service';

  @Input() service: Service;
  @Input() deletable = false;
  @Output() onDelete = new EventEmitter<Service>();

  constructor(
    private modalService: ModalService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

  delete() {
    this.modalService.open({
      title: 'INFRASTRUCTURE.VIRTUAL_MACHINE.SERVICE_REMOVAL_TITLE',
      html: `<p class="text-danger">${this.translateService.instant("INFRASTRUCTURE.VIRTUAL_MACHINE.SERVICE_REMOVAL_QUESTION")}</p>`,
    }).subscribe(close => {
      if (!close.cancel) {
        this.onDelete.emit(this.service);
      }
    });
  }
}
