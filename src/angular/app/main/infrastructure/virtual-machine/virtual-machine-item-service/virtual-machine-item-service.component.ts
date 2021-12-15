import {Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation} from '@angular/core';
import {ModalService} from "../../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {StateService} from "../../../../common/service/state.service";

@Component({
  selector: 'div[virtualMachineItemService]',
  templateUrl: './virtual-machine-item-service.component.html',
  styleUrls: ['./virtual-machine-item-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VirtualMachineItemServiceComponent {

  @HostBinding('class') clazz = 'virtual-machine-item-service';

  @Input() serviceId: string;
  @Input() deletable = false;
  @Output() onDelete = new EventEmitter<string>();

  constructor(
    private modalService: ModalService,
    private translateService: TranslateService,
    private stateService: StateService
  ) {
  }

  delete() {
    this.modalService.open({
      title: 'INFRASTRUCTURE.VIRTUAL_MACHINE.SERVICE_REMOVAL_TITLE',
      html: `<p class="text-danger">${this.translateService.instant("INFRASTRUCTURE.VIRTUAL_MACHINE.SERVICE_REMOVAL_QUESTION")}</p>`,
    }).subscribe(close => {
      if (!close.cancel) {
        this.onDelete.emit(this.serviceId);
      }
    });
  }

  get service() {
    return this.serviceId ? this.stateService.getService(this.serviceId) : undefined;
  }
}
