import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {OpenVpnService} from "../../../common/model/open-vpn-service";
import {ServiceComponent} from "../abstract/service.component";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {clone, ipValidator} from "../../../common/utils/utils";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'div[openVpnService]',
  templateUrl: './open-vpn-service.component.html',
  styleUrls: ['./open-vpn-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OpenVpnServiceComponent extends ServiceComponent {

  @HostBinding('class') clazz = 'open-vpn-service service';

  service: OpenVpnService;

  constructor(
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "openVpnService");
  }

  protected init(): void {
    this.service = clone(this.stateService.getService(this.key)) as OpenVpnService;
    this.formGroup = new FormGroup({
      ip: new FormControl(this.service.ip, [Validators.required, ipValidator]),
      clientInPort: new FormControl(this.service.clientInPort, [Validators.required]),
      vpnClientNetwork: new FormControl(this.service.vpnClientNetwork, [Validators.required, ipValidator]),
      internInPort: new FormControl(this.service.internInPort, [Validators.required]),
      connectionAttemptsNumber: new FormControl(this.service.connectionAttemptsNumber, [Validators.required])
    });
  }
}
