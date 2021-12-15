import {Injectable} from '@angular/core';
import {Host} from "../model/host";
import {Service} from "../model/service";
import {
  dhcpDnsService,
  ejbcaService,
  elkService,
  ipSecService,
  ldapService,
  mailService,
  nagiosService,
  nrpeService,
  ntpService,
  openVpnService,
  proxyService,
  repoService,
  toipWebUiService
} from "../data/defaults";
import {ElectronService} from "./electron.service";
import {Project} from "../../home/new-project/new-project.component";
import hosts from "../data/hosts";
import {APP_CONFIG} from "../../../environments/environment";
import {Observable, Subject} from "rxjs";
import {clone, getProjectFolder, jsonStringify} from "../utils/utils";
import {Firewall} from "../model/firewall";
import {ModalService} from "../component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  public static CONFIGURATOR_PROJECTS_STORES = "CONFIGURATOR_PROJECTS_STORES";
  public static CONFIGURATOR_CURRENT_PROJECT_STORE = "CONFIGURATOR_CURRENT_PROJECT_STORE";

  projects: Project[] = [];

  private current: Store = null;

  private readonly services = {
    dhcpDnsService,
    ntpService,
    mailService,
    toipWebUiService,
    ejbcaService,
    openVpnService,
    ipSecService,
    repoService,
    nrpeService,
    nagiosService,
    elkService,
    ldapService,
    proxyService
  };

  private currentChange = new Subject();

  public get currentChange$(): Observable<any> {
    return this.currentChange.asObservable();
  }

  constructor(
    private electronService: ElectronService,
    private modalService: ModalService,
    private translateService: TranslateService
  ) {
    if (this.electronService.isElectron) {
      this.electronService.ipcRenderer.on("want:close", (event) => {
        if (this.isNotSaved()) {
          this.modalService.open({
            title: "NEW_PROJECT.WARNING",
            html: `<p class="text-danger">${this.translateService.instant("NEW_PROJECT.CHANGES_NOT_SAVED")}</p>`,
            btnText: {
              validate: "YES",
              cancel: "NO"
            }
          }).subscribe(result => {
            if (result.cancel) {
              this.electronService.ipcRenderer.send("can:close");
              return;
            }
            this.save();
            this.electronService.ipcRenderer.send("can:close");
          });
        } else {
          this.electronService.ipcRenderer.send("can:close");
        }
      });
    } else if (!APP_CONFIG.production) {
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
  }

  getCurrent(): Store {
    return this.current;
  }


  save(): void {
    if (this.electronService.isElectron) {
      let projectFolder = getProjectFolder();
      if (!this.electronService.fs.existsSync(projectFolder)) {
        this.electronService.fs.mkdirSync(projectFolder, {recursive: true});
      }
      // TODO move to create project
      // const projectFile = `${projectFolder}${this.current.name}.json`;
      //       // if (this.electronService.fs.existsSync(projectFile)) {
      //       //   return;
      //       // }
      const storeText = this.serialize(this.current);
      this.writeProjectFile(this.current.name, storeText)
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

  newProject(project: Project): boolean {
    if (this.electronService.isElectron) {
      const projectFolder = getProjectFolder();
      const projectFile = `${projectFolder}${project.name}.json`;
      if (this.electronService.fs.existsSync(projectFile)) {
        return false;
      }
      if (project.duplicate) {
        const data = this.readProjectFile(project.duplicate);
        const store: Store = this.deserialize(data.toString());
        store.name = project.name;
        const storeText = this.serialize(store);
        this.writeProjectFile(store.name, storeText);
        this.setProject(project);
        return true;
      }
    }
    this.current = {
      name: project.name,
      hosts: clone(hosts) as Host[],
      firewall: {
        name: "Pare-feu",
        dmzIp: "192.168.40.100",
        exploitationIp: "192.168.223.254"
      },
      services: clone(this.services),
      serviceKeys: this.getServiceKeys(hosts)
    };
    this.save();
    this.currentChange.next();
    return true;
  }

  setProject(project: Project) {
    if (this.electronService.isElectron) {
      const storeText = this.readProjectFile(project.name);
      if (storeText) {
        this.current = this.deserialize(storeText);
        this.currentChange.next();
      }
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

  private getServiceKeys(hosts: Host[]): string[] {
    return Object.keys(this.services).map(key => this.services[key].id).filter(id => {
      if (this.services[id].notDeployable) {
        return false;
      }
      if (this.services[id].replicable) {
        return true;
      }
      for (let i = 0; i < hosts.length; i++) {
        const host = hosts[i];
        for (let j = 0; j < host.virtualMachines.length; j++) {
          const virtualMachine = host.virtualMachines[j];
          if (virtualMachine.services.indexOf(id) !== -1) {
            return false;
          }
        }
      }
      return true;
    })
  }

  removeProject(project: Project) {
    if (this.electronService.isElectron) {
      this.electronService.fs.unlinkSync(`${getProjectFolder()}${project.name}.json`);
      if (this.current && this.current.name === project.name) {
        delete this.current;
        this.currentChange.next();
      }
      return true;
    }
    return false;
  }

  private serialize(store: Store): string {
    return jsonStringify(store, clone => {
      for (const key in clone.services) {
        delete clone.services[key].icon;
        delete clone.services[key].replicable;
        delete clone.services[key].notDeployable;
        delete clone.services[key].name;
        delete clone.services[key].services;
        delete clone.serviceKeys;
      }
    });
  }

  private deserialize(serialized: string): Store {
    const store: Store = JSON.parse(serialized);
    for (const key in this.services) {
      const defaultService = this.services[key];
      if (defaultService) {
        store.services[key].name = defaultService.name;
        store.services[key].icon = defaultService.icon;
        store.services[key].replicable = defaultService.replicable;
        store.services[key].notDeployable = defaultService.notDeployable;
        store.services[key].services = defaultService.services;
      }
    }
    store.serviceKeys = this.getServiceKeys(store.hosts);
    return store;
  }

  private readProjectFile(projectName: string): string {
    return this.electronService.fs.readFileSync(`${getProjectFolder()}${projectName}.json`, "utf8");
  }

  private writeProjectFile(projectName: string, data: string) {
    this.electronService.fs.writeFileSync(`${getProjectFolder()}${projectName}.json`, data);
  }

  private isNotSaved(): boolean {
    if (this.current) {
      const saved = this.readProjectFile(this.current.name);
      const current = this.serialize(this.current);
      return saved !== current;
    }
    return false;
  }
}

export interface Store {
  name: string;
  hosts: Host[],
  firewall: Firewall,
  services: Record<string, Service>;
  serviceKeys: string[];
}
