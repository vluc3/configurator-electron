import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {Host} from "../../common/model/host";
import {ModalService} from "../../common/component/modal/modal.service";
import {HostComponent} from "./host/host.component";
import {StateService} from "../../common/service/state.service";
import {SubscriberComponent} from "../../common/abstract/subscriber.component";
import {Network} from "../../common/model/network";
import {HostVirtualMachineComponent} from "./virtual-machine/host-virtual-machine.component";

@Component({
  selector: 'div[hostList]',
  templateUrl: './host-list.component.html',
  styleUrls: ['./host-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HostListComponent extends SubscriberComponent implements OnInit {

  @HostBinding('class') clazz = 'host-list';

  hosts: Host[] = [];

  constructor(
    private modalService: ModalService,
    private stateService: StateService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.stateService.state$.pipe(takeUntil(this.unsubscribe$)).subscribe(state => {
    //   this.hosts = state.hosts;
    // });
    this.hosts = this.stateService.getHosts();
  }

  add() {
    this.modalService.open<Host>({
      title: "Nouvel hôte",
      component: HostComponent,
      data: {
        name: '',
        network: Network.EXPLOITATION,
        datastore: '',
        password: '',
        ip: '',
        virtualMachines: []
      }
    }).subscribe(close => {
      if (!close.cancel && close.data) {
        this.hosts.push(close.data);
        console.log(this.stateService.getHosts());
      }
    });
  }

  virtualMachine(host: Host) {
    this.modalService.open<Host>({
      title: "Vms & Services",
      component: HostVirtualMachineComponent,
      data: host,
      width: 800
    }).subscribe(close => {
      if (!close.cancel && close.data) {
        // this.hosts.push(close.data);
        // console.log(this.stateService.getHosts());
      }
      console.log(host);
    });
  }

  delete(host: Host) {
    this.modalService.open({
      title: 'Suppression d\'hôte',
      html: `<p class="text-danger">Êtes vous sûre de vouloir supprimer cet hôte</p>`,
    }).subscribe(close => {
      if (!close.cancel) {
        const index = this.hosts.indexOf(host);
        this.hosts.splice(index, 1);
      }
    });
  }
}
