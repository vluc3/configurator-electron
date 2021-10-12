import {AfterViewInit, Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {StateService} from "./common/service/state.service";
import {home} from "./common/utils/utils";
import {ModalService} from "./common/component/modal/modal.service";

@Component({
  selector: 'body[app]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {

  @HostBinding("class") clazz = "app";

  current = false;

  constructor(
    private modalService: ModalService,
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
    this.stateService.currentChange$.subscribe(() => {
      this.current = this.stateService.getCurrent() !== null;
    });
    this.current = this.stateService.getCurrent() !== null;
  }

  ngAfterViewInit(): void {
    if (!this.current) {
      home(this.modalService, false);
    }
  }
}
