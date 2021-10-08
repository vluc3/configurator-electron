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
import {APP_CONFIG} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private services: Record<string, Service> = {
    dhcpDnsService,
    ntpService,
    mailService,
    toipWebUiService,
    ejbcaService,
    openVpnService,
    ipSecService
  };

  projects: string[] = [];

  private store: Store = {
    name: "Config 1",
    hosts: [{
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
    services: this.services,
    serviceKeys: Object.keys(this.services).map(key => this.services[key])
  };

  state = new Subject<State>();

  get state$(): Observable<State> {
    return this.state.asObservable();
  }

  constructor(
    private electronService: ElectronService
  ) {

    if (electronService.isElectron) {
      let projectFolder = './project/';
      if (!APP_CONFIG.production) {
        projectFolder = './release/project/';
      }
      this.electronService.fs.readdir(projectFolder, (err, files) => {
        this.projects = files;
      });
      electronService.fs.readFile("config.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const storeText = data.toString();
          if (storeText) {
            this.store = JSON.parse(storeText);
          }
        }
      });
    } else {
      const projectsText = localStorage.getItem("CONFIGURATOR_PROJECTS");
      if (projectsText) {
        this.projects = JSON.parse(projectsText);
      }
      const storeText = localStorage.getItem('store');
      if (storeText) {
        this.store = JSON.parse(storeText);
      }
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
    return this.store.services[key];
  }

  setService(key: string, service: Service): void {
    this.store.services[key] = service;
    this.save();
  }

  getStore(): Store {
    return this.store;
  }

  save(): void {
    const storeText = JSON.stringify(this.store);
    if (this.electronService.isElectron) {
      this.electronService.fs.writeFile("config.json", storeText, (err: NodeJS.ErrnoException) => {
        console.error(err);
      });
    } else {
      localStorage.setItem('store', storeText);
    }
  }

  getProjects(): string[] {
    return this.projects;
  }
}

interface Store {
  name: string;
  hosts: Host[],
  services: Record<string, Service>;
  serviceKeys: Service[];
}

enum State {
  HOSTS_UPDATE
}
