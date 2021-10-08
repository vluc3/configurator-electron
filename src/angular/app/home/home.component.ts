import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalBody} from "../common/component/modal/modal.component";
import {StateService} from "../common/service/state.service";

@Component({
  selector: 'div[home]',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements ModalBody<any>, OnInit {

  @HostBinding("class") clazz = "home";

  data: any;
  projects: string[];

  constructor(
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
    this.projects = this.stateService.getProjects();
  }

}
