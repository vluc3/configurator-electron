import {Injectable} from '@angular/core';
import {Host} from "../model/host";
import {Observable, Subject} from "rxjs";
import {Network} from "../model/network";
import {Service} from "../model/service";
import {
  dhcpDnsService,
  ejbcaService,
  ipSecService,
  mailService,
  ntpService,
  openVpnService,
  toipWebUiService
} from "../utils/data";
import {ElectronService} from "./electron.service";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private _services: Record<string, Service> = {
    dhcpDnsService,
    ntpService,
    mailService,
    toipWebUiService,
    ejbcaService,
    openVpnService,
    ipSecService
  };

  private store: Store = {
    name: "Config 1",
    hosts: [{
      name: 'srv-esx1',
      network: Network.EXPLOITATION,
      datastore: 'datastore1',
      password: 'root',
      ip: '192.168.100.10',
      virtualMachines: [{
        name: 'proxy',
        ip: '192.168.2.10',
        mask: '255.255.255.0',
        gateway: '192.168.2.1',
        services: []
      }, {
        name: 'proxy',
        ip: '192.168.3.10',
        mask: '255.255.255.0',
        gateway: '192.168.3.1',
        services: []
      }]
    }, {
      name: 'srv-esx2',
      network: Network.EXPLOITATION,
      datastore: 'datastore1',
      password: 'root',
      ip: '192.168.100.11',
      virtualMachines: [{
        name: 'proxy',
        ip: '192.168.12.10',
        mask: '255.255.255.0',
        gateway: '192.168.12.1',
        services: []
      }, {
        name: 'proxy',
        ip: '192.168.12.11',
        mask: '255.255.255.0',
        gateway: '192.168.12.1',
        services: []
      }, {
        name: 'proxy',
        ip: '192.168.12.12',
        mask: '255.255.255.0',
        gateway: '192.168.12.1',
        services: []
      }, {
        name: 'proxy',
        ip: '192.168.12.13',
        mask: '255.255.255.0',
        gateway: '192.168.12.1',
        services: []
      }]
    }, {
      name: 'srv-esx3',
      network: Network.EXPLOITATION,
      datastore: 'datastore1',
      password: 'root',
      ip: '192.168.101.11',
      virtualMachines: []
    }, {
      name: 'srv-esx4',
      network: Network.EXPLOITATION,
      datastore: 'datastore1',
      password: 'root',
      ip: '192.168.101.11',
      virtualMachines: []
    }, {
      name: 'srv-esx5',
      network: Network.EXPLOITATION,
      datastore: 'datastore1',
      password: 'root',
      ip: '192.168.101.11',
      virtualMachines: []
    }, {
      name: 'srv-esx6',
      network: Network.EXPLOITATION,
      datastore: 'datastore1',
      password: 'root',
      ip: '192.168.101.11',
      virtualMachines: []
    }, {
      name: 'srv-esx10',
      network: Network.DMZ,
      datastore: 'datastore1',
      password: 'root',
      ip: '192.168.101.10',
      virtualMachines: [{
        name: 'proxy',
        ip: '192.168.12.10',
        mask: '255.255.255.0',
        gateway: '192.168.12.1',
        services: []
      }]
    }],
    services: Object.keys(this._services).map(key => this.getService(key))
  };

  state = new Subject<State>();

  get state$(): Observable<State> {
    return this.state.asObservable();
  }

  constructor(
    private electronService: ElectronService
  ) {
    const storeText = localStorage.getItem('store');
    if (storeText) {
      this.store = JSON.parse(storeText);
    }
  }

  updateHosts(hosts: Host[]) {
    this.store.hosts = hosts;
    this.state.next(State.HOSTS_UPDATE);
  }

  getHosts(): Host[] {
    return this.store.hosts;
  }

  getService(key: string): Service {
    return this._services[key];
  }

  getStore(): Store {
    return this.store;
  }

  save(): void {
    const storeText = JSON.stringify(this.store);
    localStorage.setItem('store', storeText);
  }
}

interface Store {
  name: string;
  hosts: Host[],
  services: Service[];
}

enum State {
  HOSTS_UPDATE
}
