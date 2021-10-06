import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {Host} from "../../../common/model/host";
import {ModalService} from "../../../common/component/modal/modal.service";
import {NewHostComponent} from "./new-host/new-host.component";
import {StateService} from "../../../common/service/state.service";
import {SubscriberComponent} from "../../../common/abstract/subscriber.component";
import {Network} from "../../../common/model/network";

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
    this.hosts = this.stateService.getHosts();
  }

  add() {
    this.modalService.open<Host>({
      title: "INFRASTRUCTURE.HOST.NEW_HOST",
      component: NewHostComponent,
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
        this.stateService.save();
      }
    });
  }

  delete(host: Host) {
    const index = this.hosts.indexOf(host);
    this.hosts.splice(index, 1);
    this.stateService.save();
  }
}
