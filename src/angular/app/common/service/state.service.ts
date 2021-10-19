import {Injectable} from '@angular/core';
import {Host} from "../model/host";
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
import {Project} from "../../home/new-project/new-project.component";
import hosts from "../data/hosts.json";
import {APP_CONFIG} from "../../../environments/environment";
import {Observable, Subject} from "rxjs";
import {clone} from "../utils/utils";
import {Firewall} from "../model/firewall";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  public static CONFIGURATOR_PROJECTS_STORES = "CONFIGURATOR_PROJECTS_STORES";
  public static CONFIGURATOR_CURRENT_PROJECT_STORE = "CONFIGURATOR_CURRENT_PROJECT_STORE";

  projects: Project[] = [];

  private current: Store = null;

  private currentChange = new Subject();

  public get currentChange$(): Observable<any> {
    return this.currentChange.asObservable();
  }

  constructor(
    private electronService: ElectronService
  ) {
    if (!this.electronService.isElectron) {
      const currentText = localStorage.getItem(StateService.CONFIGURATOR_CURRENT_PROJECT_STORE);
      if (currentText) {
        this.current = JSON.parse(currentText);
      }
    }
  }

  getService(key: string): Service {
    return this.current.services[key];
  }

  setService(key: string, service: Service): void {
    this.current.services[key] = service;
    // this.save();
  }

  getCurrent(): Store {
    return this.current;
  }

  save(): void {
    if (this.electronService.isElectron) {
      let projectFolder = './project/';
      if (!APP_CONFIG.production) {
        projectFolder = './release/project/';
      }
      if (!this.electronService.fs.existsSync(projectFolder)) {
        this.electronService.fs.mkdirSync(projectFolder, {recursive: true});
      }
      const storeText = JSON.stringify(this.current);
      this.electronService.fs.writeFile(`${projectFolder}${this.current.name}.json`, storeText, (err: NodeJS.ErrnoException) => {
        console.error(err);
      });
    } else if (!APP_CONFIG.production) {
      let projectStores: Record<string, Store> = {};
      const projectStoresText = localStorage.getItem(StateService.CONFIGURATOR_PROJECTS_STORES);
      if (projectStoresText) {
        projectStores = JSON.parse(projectStoresText);
      }
      projectStores[this.current.name] = this.current;
      localStorage.setItem(StateService.CONFIGURATOR_PROJECTS_STORES, JSON.stringify(projectStores));
      localStorage.setItem(StateService.CONFIGURATOR_CURRENT_PROJECT_STORE, JSON.stringify(this.current));
    }
  }

  newProject(project: Project) {
    const services = {
      dhcpDnsService,
      ntpService,
      mailService,
      toipWebUiService,
      ejbcaService,
      openVpnService,
      ipSecService
    };
    this.current = {
      name: project.name,
      hosts: clone(hosts) as Host[],
      firewall: {
        dmzIp: "192.168.40.100",
        exploitationIp: "192.168.223.254"
      },
      services,
      serviceKeys: Object.keys(services).map(key => services[key])
    };
    this.save();
    this.currentChange.next();
  }

  setProject(project: Project) {
    if (this.electronService.isElectron) {
      let projectFolder = './project/';
      if (!APP_CONFIG.production) {
        projectFolder = './release/project/';
      }
      this.electronService.fs.readFile(`${projectFolder}${project.name}.json`, "utf8", (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const storeText = data.toString();
          if (storeText) {
            this.current = JSON.parse(storeText);
            this.currentChange.next();
          }
        }
      });
    } else if (!APP_CONFIG.production) {
      const projectStoresText = localStorage.getItem("CONFIGURATOR_PROJECTS_STORES");
      if (projectStoresText) {
        const projectStores: Record<string, Store> = JSON.parse(projectStoresText);
        this.current = projectStores[project.name];
        localStorage.setItem(StateService.CONFIGURATOR_CURRENT_PROJECT_STORE, JSON.stringify(this.current));
        this.currentChange.next();
      }
    }
  }
}

interface Store {
  name: string;
  hosts: Host[],
  firewall: Firewall,
  services: Record<string, Service>;
  serviceKeys: Service[];
}
