import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Host} from "../../../../common/model/host";
import {VirtualMachine} from "../../../../common/model/virtual-machine";
import {NewVirtualMachineComponent} from "../new-virtual-machine/new-virtual-machine.component";
import {ModalService} from "../../../../common/component/modal/modal.service";
import {StateService} from "../../../../common/service/state.service";
import {NewHostComponent} from "../../host-list/new-host/new-host.component";
import {clone} from "../../../../common/utils/utils";
import {ServiceDragInfo} from "../../../../common/model/service-drag-info";
import {elkAgentService, nrpeService} from "../../../../common/data/defaults";
import { OperatingSystemEnum } from '../../../../common/model/operating-system.enum';

@Component({
  selector: 'div[hostItem]',
  templateUrl: './host-item.component.html',
  styleUrls: ['./host-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HostItemComponent implements OnInit {

  @HostBinding('class') clazz = 'host-item';

  @Input() host: Host;
  @Output() virtualMachineDrop = new EventEmitter<{ event: DragEvent, virtualMachine: VirtualMachine }>();
  @Output() serviceDragStart = new EventEmitter<ServiceDragInfo>();
  @Output() onDelete = new EventEmitter<Host>();

  constructor(
    private modalService: ModalService,
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
  }

  virtualMachine() {
    this.modalService.open<VirtualMachine>({
      title: "Vms & Services",
      component: NewVirtualMachineComponent,
      data: {
        services: [],
        ip: '',
        mask: '',
        operatingSystem: OperatingSystemEnum.Debian,
      },
      width: 800
    }).subscribe(close => {
      if (!close.cancel && close.data) {
        if (close.data.operatingSystem === OperatingSystemEnum.Debian) {
          close.data.services = [nrpeService.id, elkAgentService.id];
        }

        this.host.virtualMachines?.push(close.data);
        // this.stateService.save();
      }
    });
  }

  edit() {
    this.modalService.open({
      title: "Modification d'hôte",
      data: clone(this.host),
      component: NewHostComponent
    }).subscribe(close => {
      if (!close.cancel && close.data) {
        this.host = close.data
        // this.stateService.save();
      }
    });
  }

  onVmDelete(virtualMachine: VirtualMachine) {
    const index = this.host.virtualMachines.indexOf(virtualMachine);
    if (index !== -1) {
      virtualMachine.services.forEach(id => {
        if (this.stateService.getService(id).replicable) {
          return;
        }
        this.stateService.getCurrent().serviceKeys.push(id);
      });
      this.host.virtualMachines.splice(index, 1);
      // this.stateService.save();
    }
  }
}
