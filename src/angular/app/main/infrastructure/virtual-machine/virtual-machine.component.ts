import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {StateService} from "../../../common/service/state.service";
import {Host} from "../../../common/model/host";
import {ModalService} from "../../../common/component/modal/modal.service";
import {Network} from "../../../common/model/network";
import {ServiceDragInfo} from "../../../common/model/service-drag-info";
import {ServiceDropInfo} from "../../../common/model/service-drop-info";

import {draggableDmzServiceIds, notDroppableDmzServiceIds} from '../../../common/data/defaults';
import { VirtualMachine } from '../../../common/model/virtual-machine';
import { Service } from '../../../common/model/service';

@Component({
  selector: 'div[virtualMachineI]',
  templateUrl: './virtual-machine.component.html',
  styleUrls: ['./virtual-machine.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VirtualMachineComponent implements OnInit {

  @HostBinding('class') clazz = 'virtual-machine';

  hosts: Host[];

  serviceIds: string[];

  networks: Network[] = [Network.EXPLOITATION, Network.DMZ];

  constructor(
    private modalService: ModalService,
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
    this.hosts = this.stateService.getCurrent().hosts;
    this.serviceIds = this.stateService.getCurrent().serviceKeys;
  }

  getHosts(network: Network): Host[] {
    return this.hosts.filter(host => host.network === network);
  }

  serviceDragStart(serviceDragInfo: ServiceDragInfo, host: Host) {
    if (! this.dragEnabled(serviceDragInfo.serviceId, host.network)) {
      return;
    }

    const hostIndex = this.hosts.indexOf(host);
    const vmIndex = host.virtualMachines.indexOf(serviceDragInfo.virtualMachine);
    serviceDragInfo.event.dataTransfer?.setData("position", `${hostIndex}-${vmIndex}`);
    serviceDragInfo.event.dataTransfer?.setData("serviceId", serviceDragInfo.serviceId);
  }

  dragstart(event: DragEvent, serviceId: string): void {
    event?.dataTransfer?.setData("serviceId", serviceId);
  }

  /**
   *
   * @param event
   * @param network
   */
  virtualMachineDrop(event: ServiceDropInfo, network: Network) {
    event.event.preventDefault();
    const serviceId = event.event.dataTransfer?.getData("serviceId");

    if (serviceId) {
      if (! this.dropEnabled(serviceId, network)) {
        return;
      }

      const position = event.event.dataTransfer?.getData("position");
      if (position) {
        // Drag & Drop from another VM
        const positions = position.split('-');
        const hostIndex = Number(positions[0]);
        const virtualMachineIndex = Number(positions[1]);
        const virtualMachine: VirtualMachine = this.hosts[hostIndex].virtualMachines[virtualMachineIndex];
        const index = virtualMachine.services.findIndex(id => id === serviceId);

        if (index !== -1) {
          if (event.virtualMachine) {
            const serviceId = virtualMachine.services[index];
            const service: Service = this.stateService.getService(serviceId);

            if (this.stateService.serviceOperatingSystemMatches(service, event.virtualMachine.operatingSystem)) {
              if (service.replicable) {
                if (event.virtualMachine.services.findIndex(id => id === serviceId) === -1) {
                  event.virtualMachine.services?.push(serviceId);
                  virtualMachine.services.splice(index, 1);
                } else {
                  // TODO dialog error
                }
              } else {
                event.virtualMachine.services?.push(serviceId);
                virtualMachine.services.splice(index, 1);
              }
            }
          }
        }
      } else {
        // Drag & Drop from services right list
        const index = this.serviceIds.findIndex(id => id === serviceId);

        if (index !== -1) {
          const serviceId = this.serviceIds[index];
          const service: Service = this.stateService.getService(serviceId);

          if (this.stateService.serviceOperatingSystemMatches(service, event.virtualMachine.operatingSystem)) {
            if (service.replicable) {
              if (event.virtualMachine.services.findIndex(id => id === serviceId) === -1) {
                event.virtualMachine.services?.push(serviceId);
              } else {
                // TODO dialog error
              }
            } else {
              event.virtualMachine?.services?.push(serviceId);
              this.serviceIds.splice(index, 1);
            }
          }
        }
      }

      // this.stateService.save();
    }
  }

  /**
   * Delete Host
   * @param host
   */
  delete(host: Host) {
    const index = this.hosts.indexOf(host);
    if (index !== -1) {
      host.virtualMachines.forEach(virtualMachine => {
        this.stateService.getCurrent().serviceKeys.push(...virtualMachine.services);
      });
      this.hosts.splice(index, 1);
      // this.stateService.save();
    }
  }

  private dragEnabled(serviceId: string, network: Network): boolean {
    if (network === Network.DMZ) {
      const index: number = draggableDmzServiceIds.findIndex((draggableDmzServiceId: string) => {
        return draggableDmzServiceId === serviceId;
      });

      if (index === -1) {
        return false;
      }
    }

    return true;
  }

  private dropEnabled(serviceId: string, network: Network): boolean {
    let result: boolean = this.dragEnabled(serviceId, network);

    if (result) {
      if (network !== Network.DMZ) {
        const index: number = notDroppableDmzServiceIds.findIndex((droppableDmzServiceId: string) => {
          return droppableDmzServiceId === serviceId;
        });

        if (index > -1) {
          result = false;
        }
      }
    }

    return result;
  }
}
