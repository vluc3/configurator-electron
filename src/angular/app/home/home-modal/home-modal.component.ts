import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalBody} from "../../common/component/modal/modal.component";
import {StateService} from "../../common/service/state.service";
import {ModalService} from "../../common/component/modal/modal.service";
import {NewProjectComponent, Project} from "../new-project/new-project.component";
import {home} from "../../common/utils/utils";
import {ElectronService} from "../../common/service/electron.service";
import {APP_CONFIG} from "../../../environments/environment";
import {Router} from "@angular/router";

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

  constructor(
    private stateService: StateService,
    private modalService: ModalService,
    private electronService: ElectronService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (this.electronService.isElectron) {
      let projectFolder = './project/';
      if (!APP_CONFIG.production) {
        projectFolder = './release/project/';
      }
      this.electronService.fs.readdir(projectFolder, (err, files) => {
        if (err) {
          return;
        }
        files.forEach(file => {
          this.projects.push({name: file.split(".")[0], file});
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

  newProject() {
    this.modalService.close();
    setTimeout(() => {
      this.modalService.open<Project>({
        title: "NEW_PROJECT.NEW_PROJECT",
        component: NewProjectComponent,
        width: 600,
        data: {
          name: ""
        }
      }).subscribe(close => {
        if (close.cancel) {
          setTimeout(() => {
            home(this.modalService, this.stateService.getCurrent() !== null)
          }, 600);
        } else if (close.data) {
          this.stateService.newProject(close.data);
          this.router.navigate(["infrastructure", "host"]);
        }
      });
    }, 500);
  }

  setProject(project: Project) {
    this.stateService.setProject(project);
    this.router.navigate(["infrastructure", "host"]);
    this.modalService.close();
  }
}
