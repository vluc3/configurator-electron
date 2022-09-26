import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {MobileIronService} from "../../../common/model/mobile-iron-service";
import {ServiceComponent} from "../abstract/service.component";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {clone, ipValidator, networkIpValidator} from "../../../common/utils/utils";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'div[mobileIronService]',
  templateUrl: './mobile-iron-service.component.html',
  styleUrls: ['./mobile-iron-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MobileIronServiceComponent extends ServiceComponent {

  @HostBinding('class') clazz = 'mobile-iron-service service';

  service: MobileIronService;

  constructor(
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "mobileIronService");
  }

  protected init(): void {
    this.service = clone(this.stateService.getService(this.key)) as MobileIronService;
    this.formGroup = new FormGroup({
      serverIp: new FormControl(this.service.serverIp, [Validators.required, ipValidator]),
      syncPort: new FormControl(this.service.syncPort, [Validators.required]),
      certificate: new FormControl(this.service.certificate, [Validators.required]),
      dnsZone: new FormControl(this.service.dnsZone, [Validators.required])
    });
  }
}
