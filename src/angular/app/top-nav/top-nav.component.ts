import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {StateService} from "../common/service/state.service";
import {ModalService} from "../common/component/modal/modal.service";
import {HomeComponent} from "../home/home.component";

@Component({
  selector: 'div[topNav]',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopNavComponent implements OnInit {

  @HostBinding("class") clazz = "top-nav bg-dark";

  constructor(
    private stateService: StateService,
    private modalService: ModalService
  ) {
  }

  ngOnInit(): void {
  }

  home() {
    this.modalService.open<any>({
      title: "TOP_NAV.HOME",
      component: HomeComponent,
      data: {}
    }).subscribe(close => {
      if (!close.cancel && close.data) {
      }
    });
  }

  export() {
  }

  save() {
  }
}
