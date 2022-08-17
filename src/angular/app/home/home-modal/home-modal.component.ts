import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalBody} from "../../common/component/modal/modal.component";
import {StateService} from "../../common/service/state.service";
import {ModalService} from "../../common/component/modal/modal.service";
import {NewProjectComponent, Project} from "../new-project/new-project.component";
import {getProjectFolder, home} from "../../common/utils/utils";
import {ElectronService} from "../../common/service/electron.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {window} from "rxjs/operators";

@Component({
  selector: 'div[homeModal]',
  templateUrl: './home-modal.component.html',
  styleUrls: ['./home-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeModalComponent implements ModalBody<any>, OnInit {

  @HostBinding("class") clazz = "home-modal";

  data: any;
  projects: Project[] = [];

  get version() {
    let version = "";
    if (this.electronService.isElectron) {
      // @ts-ignore
      // version = this.electronService.process.env.npm_package_version;
      version = '1.2.1';
    }
    return {
      version
    }
  }

  constructor(
    private stateService: StateService,
    private modalService: ModalService,
    private electronService: ElectronService,
    private router: Router,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.init();
  }

  private init() {
    this.projects = [];
    if (this.electronService.isElectron) {
      this.electronService.fs.readdir(getProjectFolder(), (err, files) => {
        if (err) {
          return;
        }
        files.forEach(file => {
          this.projects.push({name: file.split(".")[0]});
        });
      });
    } else {
      const projectStoreText = localStorage.getItem(StateService.CONFIGURATOR_PROJECTS_STORES);
      if (projectStoreText) {
        this.projects = Object.keys(JSON.parse(projectStoreText)).map(name => {
          return {name};
        });
      }
    }
  }

  newProject(duplicate?: string) {
    this.modalService.open<Project>({
      title: duplicate ? "NEW_PROJECT.DUPLICATE_PROJECT" : "NEW_PROJECT.NEW_PROJECT",
      titleParams: duplicate ? {name: duplicate} : undefined,
      component: NewProjectComponent,
      width: 600,
      data: {
        name: "",
        duplicate
      }
    }).subscribe(close => {
      if (close.cancel) {
        home(this.modalService, this.stateService.getCurrent() !== null)
      } else if (close.data) {
        if (!this.stateService.newProject(close.data)) {
          this.nameAlreadyExists(close.data);
          return;
        }
        this.router.navigate(["infrastructure", "host"]);
      }
    });
  }

  private nameAlreadyExists(project: Project) {
    this.modalService.open({
      title: 'NEW_PROJECT.NEW_PROJECT',
      html: `<p class="text-danger">${this.translateService.instant('HOME.PROJECT_WITH_THIS_NAME_ALREADY_EXISTS')}</p>`,
    }).subscribe(close => {
      if (close.cancel) {
        home(this.modalService, this.stateService.getCurrent() !== null);
      } else {
        this.newProject(project.duplicate);
      }
    });
  }

  setProject(project: Project) {
    this.stateService.setProject(project);
    this.router.navigate(["infrastructure", "host"]);
    this.modalService.close();
  }

  duplicate(project: Project) {
    this.newProject(project.name);
  }

  remove(project: Project) {
    this.modalService.open({
      title: 'HOME.PROJECT_REMOVE',
      html: `<p class="text-danger">${this.translateService.instant("HOME.PROJECT_REMOVE_QUESTION", {name: project.name})}</p>`,
    }).subscribe(close => {
      if (close.cancel) {
        home(this.modalService, this.stateService.getCurrent() !== null);
      } else {
        if (this.stateService.removeProject(project)) {
          home(this.modalService, this.stateService.getCurrent() !== null);
        }
      }
    });
  }
}
