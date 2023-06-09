import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {IpSecService, Option} from "../../../common/model/ip-sec-service";
import {ServiceComponent} from "../abstract/service.component";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {clone, ipValidator, networkIpValidator} from "../../../common/utils/utils";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'div[ipSecService]',
  templateUrl: './ip-sec-service.component.html',
  styleUrls: ['./ip-sec-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IpSecServiceComponent extends ServiceComponent {

  @HostBinding('class') clazz = 'ip-sec-service service';

  service: IpSecService;

  protocols = [{
    title: "SERVICE.IP_SEC.ENCRYPTION_ALGORITHM",
    key: "encryptionAlgorithms"
  }, {
    title: "SERVICE.IP_SEC.PSEUDO_RANDOM_FUNCTION",
    key: "pseudoRandomFunctions"
  }, {
    title: "SERVICE.IP_SEC.INTEGRITY",
    key: "integrity"
  }, {
    title: "SERVICE.IP_SEC.DIFFIE_HELLMAN",
    key: "diffieHellman"
  }];

  constructor(
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "ipSecService");
  }

  protected init(): void {
    this.service = clone(this.stateService.getService(this.key)) as IpSecService;
    this.formGroup = new FormGroup({
      ip: new FormControl(this.service.ip, [Validators.required, ipValidator]),
      clientInPort: new FormControl(this.service.clientInPort, [Validators.required]),
      vpnClientNetwork: new FormControl(this.service.vpnClientNetwork, [Validators.required, networkIpValidator]),
      authenticationDuration: new FormControl(this.service.authenticationDuration, [Validators.required]),
      connectionAttemptsNumber: new FormControl(this.service.connectionAttemptsNumber, [Validators.required])
    });
  }

  onOptionChange(event: Event, option: Option) {
    option.enabled = (event.target as HTMLInputElement).checked;
    this.save();
  }
}
