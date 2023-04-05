import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {JabberService} from "../../../common/model/jabber-service";
import {ServiceComponent} from "../abstract/service.component";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {clone} from "../../../common/utils/utils";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'div[jabberService]',
  templateUrl: './jabber-service.component.html',
  styleUrls: ['./jabber-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JabberServiceComponent extends ServiceComponent {

  @HostBinding('class') clazz = 'jabber-service service';

  service: JabberService;

  constructor(
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "jabberService");
  }

  protected init(): void {
    this.service = clone(this.stateService.getService(this.key)) as JabberService;
    this.formGroup = new FormGroup({
      port: new FormControl(this.service.port, [Validators.required]),
    });
  }
}
