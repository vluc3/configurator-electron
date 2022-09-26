import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {WireGuardService} from "../../../common/model/wire-guard-service";
import {ServiceComponent} from "../abstract/service.component";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {clone, ipValidator, networkIpValidator} from "../../../common/utils/utils";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'div[wireGuardService]',
  templateUrl: './wire-guard-service.component.html',
  styleUrls: ['./wire-guard-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WireGuardServiceComponent extends ServiceComponent {

  @HostBinding('class') clazz = 'wire-guard-service service';

  service: WireGuardService;

  constructor(
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "wireGuardService");
  }

  protected init(): void {
    this.service = clone(this.stateService.getService(this.key)) as WireGuardService;
    this.formGroup = new FormGroup({
      ip: new FormControl(this.service.ip, [Validators.required, ipValidator]),
      clientInPort: new FormControl(this.service.clientInPort, [Validators.required]),
      vpnClientNetwork: new FormControl(this.service.vpnClientNetwork, [Validators.required, networkIpValidator]),
      internInPort: new FormControl(this.service.internInPort, [Validators.required])
    });
  }
}
