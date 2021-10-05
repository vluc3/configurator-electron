import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {StateService} from "../../../common/service/state.service";
import {Host} from "../../../common/model/host";
import {ModalService} from "../../../common/component/modal/modal.service";
import {Service} from "../../../common/model/service";
import {Network} from "../../../common/model/network";
import {ServiceDragInfo} from "../../../common/model/service-drag-info";
import {ServiceDropInfo} from "../../../common/model/service-drop-info";

@Component({
  selector: 'div[virtualMachineR]',
  templateUrl: './virtual-machine.component.html',
  styleUrls: ['./virtual-machine.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VirtualMachineComponent implements OnInit {

  @HostBinding('class') clazz = 'virtual-machine';

  hosts: Host[];

  services: Service[];

  networks: Network[] = [Network.EXPLOITATION, Network.DMZ];

  constructor(
    private modalService: ModalService,
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
    this.hosts = this.stateService.getHosts();
    this.services = this.stateService.getStore().serviceKeys;
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
    serviceDragInfo.event.dataTransfer?.setData("serviceName", serviceDragInfo.service.name);
  }

  dragstart(event: DragEvent, service: Service): void {
    event?.dataTransfer?.setData("serviceName", service.name);
  }

  drop(event: DragEvent) {
    event.preventDefault();
    const serviceName = event?.dataTransfer?.getData("serviceName");
    if (serviceName) {
      const position = event?.dataTransfer?.getData("position");
      if (position) {
        const p = position.split('-');
        const hostIndex = Number(p[0]);
        const vmIndex = Number(p[1]);
        const index = this.hosts[hostIndex].virtualMachines[vmIndex].services.findIndex(s => s.name === serviceName);
        if (index !== -1) {
          const service = this.hosts[hostIndex].virtualMachines[vmIndex].services[index];
          this.services.push(service);
          this.hosts[hostIndex].virtualMachines[vmIndex].services.splice(index, 1);
        }
      }
      this.stateService.save();
    }
  }

  virtualMachineDrop(event: ServiceDropInfo, network: Network) {
    event.event.preventDefault();
    if (network === Network.DMZ) {
      return;
    }
    const serviceName = event.event.dataTransfer?.getData("serviceName");
    if (serviceName) {
      const position = event.event.dataTransfer?.getData("position");
      if (position) {
        const p = position.split('-');
        const hostIndex = Number(p[0]);
        const vmIndex = Number(p[1]);
        const index = this.hosts[hostIndex].virtualMachines[vmIndex].services.findIndex(s => s.name === serviceName);
        if (index !== -1) {
          const service = this.hosts[hostIndex].virtualMachines[vmIndex].services[index];
          if (event.virtualMachine) {
            event.virtualMachine.services?.push(service);
          }
          this.hosts[hostIndex].virtualMachines[vmIndex].services.splice(index, 1);
        }
      } else {
        const index = this.services.findIndex(s => s.name === serviceName);
        if (index !== -1) {
          event.virtualMachine?.services?.push(this.services[index]);
          this.services.splice(index, 1);
        }
      }
      this.stateService.save();
    }
  }

  delete(host: Host) {
    const index = this.hosts.indexOf(host);
    if (index !== -1) {
      host.virtualMachines.forEach(virtualMachine => {
        this.stateService.getStore().serviceKeys.push(...virtualMachine.services);
      });
      this.hosts.splice(index, 1);
      this.stateService.save();
    }
  }

  // add() {
  //   this.modalService.open<Host>({
  //     title: "Nouvel hôte",
  //     component: HostComponent,
  //     data: {
  //       name: '',
  //       network: Network.EXPLOITATION,
  //       datastore: '',
  //       password: '',
  //       ip: '',
  //       virtualMachines: []
  //     }
  //   }).subscribe(close => {
  //     if (!close.cancel && close.data) {
  //       this.hosts.push(close.data);
  //       this.stateService.save();
  //     }
  //   });
  // }
}
