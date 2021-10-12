import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Service} from "../../../../common/model/service";
import {ModalService} from "../../../../common/component/modal/modal.service";

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
    private modalService: ModalService
  ) {
  }

  ngOnInit(): void {
  }

  delete() {
    this.modalService.open({
      title: 'INFRASTRUCTURE.VIRTUAL_MACHINE.SERVICE_REMOVAL_TITLE',
      html: `<p class="text-danger">Êtes vous sûre de vouloir supprimer ce setvice</p>`,
    }).subscribe(close => {
      if (!close.cancel) {
        this.onDelete.emit(this.service);
      }
    });
  }
}
