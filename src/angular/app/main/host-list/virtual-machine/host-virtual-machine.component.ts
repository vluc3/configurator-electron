import {AfterViewInit, Component, EventEmitter, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalBody} from "../../../common/component/modal/modal.component";
import {Host} from "../../../common/model/host";
import {VirtualMachine} from "../../../common/model/virtual-machine";

@Component({
  selector: 'div[hostVirtualMachine]',
  templateUrl: './host-virtual-machine.component.html',
  styleUrls: ['./host-virtual-machine.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HostVirtualMachineComponent implements ModalBody<Host>, OnInit, AfterViewInit {

  @HostBinding('class') clazz = 'host-virtual-machine';

  data?: Host;
  dataValidate = new EventEmitter<{ valid: boolean, data?: Host }>();
  virtualMachines: VirtualMachine[] = [];

  services = [
    'DNS/DHCP',
    'NTP',
    'Mails',
    'TOIP/Web UI',
    'EJBCA',
    'OpenVPN',
    'IPSec'
  ];

  constructor() {
  }

  ngOnInit(): void {
    if (this.data?.virtualMachines) {
      this.virtualMachines = this.data?.virtualMachines;
    }
  }

  ngAfterViewInit(): void {
  }

  add() {
    // this.virtualMachines.push({
    //   name: 'VM',
    //   services: []
    // });
  }

  dragstart(event: DragEvent, service: string) {
    console.log("dragend", event);
    event?.dataTransfer?.setData("service", service);
  }

  drop(event: DragEvent, virtualMachine: VirtualMachine) {
    console.log("drop", event);
    event.preventDefault();
    const service = event?.dataTransfer?.getData("service");
    if (service) {
      virtualMachine.services?.push({name: service});
    }
    console.log(virtualMachine.services);
  }
}
