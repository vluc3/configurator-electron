import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {VirtualMachine} from "../../../../common/model/virtual-machine";
import {Service} from "../../../../common/model/service";
import {ModalService} from "../../../../common/component/modal/modal.service";
import {StateService} from "../../../../common/service/state.service";
import {NewVirtualMachineComponent} from "../new-virtual-machine/new-virtual-machine.component";
import {clone} from "../../../../common/utils/utils";
import {TranslateService} from "@ngx-translate/core";
import {Host} from "../../../../common/model/host";
import {nrpeService} from "../../../../common/data/defaults";

@Component({
  selector: 'div[virtualMachineItem]',
  templateUrl: './virtual-machine-item.component.html',
  styleUrls: ['./virtual-machine-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VirtualMachineItemComponent implements OnInit {

  @HostBinding('class') clazz = 'virtual-machine-item';

  @Input() virtualMachine: VirtualMachine;
  @Input() host: Host;
  @Input() deletable = true;
  /**
   * Output to propagate service drag start event
   */
  @Output() serviceDragStart = new EventEmitter<{ serviceId: string, event: DragEvent }>();
  @Output() onDelete = new EventEmitter<VirtualMachine>();

  constructor(
    private modalService: ModalService,
    private stateService: StateService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

  edit() {
    this.modalService.open<VirtualMachine>({
      title: "Vms & Services",
      component: NewVirtualMachineComponent,
      data: clone(this.virtualMachine),
      width: 800
    }).subscribe(close => {
      if (!close.cancel && close.data) {
        Object.assign(this.virtualMachine, close.data);
        this.stateService.save();
      }
    });
  }

  clone() {
    const vm = clone(this.virtualMachine);
    vm.ip = vm.ip.substring(0, vm.ip.lastIndexOf("."));
    vm.name = "";
    vm.services = [nrpeService.id];
    this.modalService.open<VirtualMachine>({
      title: "Vms & Services",
      component: NewVirtualMachineComponent,
      data: vm,
      width: 800
    }).subscribe(close => {
      if (!close.cancel && close.data) {
        this.host.virtualMachines.push(close.data)
        this.stateService.save();
      }
    });
  }

  delete() {
    this.modalService.open({
      title: 'VM_REMOVAL_TITLE',
      html: `<p class="text-danger">${this.translateService.instant('INFRASTRUCTURE.VIRTUAL_MACHINE.VM_REMOVAL_QUESTION')}</p>`,
    }).subscribe(close => {
      if (!close.cancel) {
        this.onDelete.emit(this.virtualMachine);
      }
    });
  }

  onServiceDelete(serviceId: string) {
    const index = this.virtualMachine.services.indexOf(serviceId);
    if (index !== -1) {
      this.virtualMachine.services.splice(index, 1);
      const isReplicable = this.stateService.getService(serviceId).replicable;
      if (!isReplicable) {
        this.stateService.getCurrent().serviceKeys.push(serviceId);
      }
      this.stateService.save();
    }
  }
}
