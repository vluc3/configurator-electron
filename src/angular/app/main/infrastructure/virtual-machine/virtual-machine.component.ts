import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {StateService} from "../../../common/service/state.service";
import {Host} from "../../../common/model/host";
import {ModalService} from "../../../common/component/modal/modal.service";
import {Network} from "../../../common/model/network";
import {ServiceDragInfo} from "../../../common/model/service-drag-info";
import {ServiceDropInfo} from "../../../common/model/service-drop-info";

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
    if (host.network === Network.DMZ) {
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
    // Deactivate temporally for DMZ network
    if (network === Network.DMZ) {
      return;
    }
    const serviceId = event.event.dataTransfer?.getData("serviceId");
    if (serviceId) {
      const position = event.event.dataTransfer?.getData("position");
      if (position) {
        // Drag & Drop from another VM
        const p = position.split('-');
        const hostIndex = Number(p[0]);
        const vmIndex = Number(p[1]);
        const index = this.hosts[hostIndex].virtualMachines[vmIndex].services.findIndex(id => id === serviceId);
        if (index !== -1) {
          const service = this.hosts[hostIndex].virtualMachines[vmIndex].services[index];
          if (event.virtualMachine) {
            const isReplicable = this.stateService.getService(service).replicable;
            if (isReplicable) {
              if (event.virtualMachine.services.findIndex(id => id === serviceId) === -1) {
                event.virtualMachine.services?.push(service);
                this.hosts[hostIndex].virtualMachines[vmIndex].services.splice(index, 1);
              } else {
                // TODO dialog error
              }
            } else {
              event.virtualMachine.services?.push(service);
              this.hosts[hostIndex].virtualMachines[vmIndex].services.splice(index, 1);
            }
          }
        }
      } else {
        // Drag & Drop from services right list
        const index = this.serviceIds.findIndex(id => id === serviceId);
        if (index !== -1) {
          const service = this.serviceIds[index];
          const isReplicable = this.stateService.getService(service).replicable;
          if (isReplicable) {
            if (event.virtualMachine.services.findIndex(id => id === serviceId) === -1) {
              event.virtualMachine.services?.push(service);
            } else {
              // TODO dialog error
            }
          } else {
            event.virtualMachine?.services?.push(service);
            this.serviceIds.splice(index, 1);
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
}
