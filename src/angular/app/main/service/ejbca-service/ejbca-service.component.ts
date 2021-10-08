import {Component, HostBinding} from '@angular/core';
import {EjbcaService} from "../../../common/model/ejbca-service";
import {ServiceComponent} from "../abstract/service.component";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {clone, copyEntries} from "../../../common/utils/utils";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'div[ejbcaService]',
  templateUrl: './ejbca-service.component.html',
  styleUrls: ['./ejbca-service.component.scss']
})
export class EjbcaServiceComponent extends ServiceComponent {

  @HostBinding('class') clazz = 'ejbca-service service';

  service: EjbcaService;

  constructor(
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "ejbcaService");
  }

  protected init(): void {
    this.service = clone(this.stateService.getService('ejbcaService')) as EjbcaService;
    this.formGroup = new FormGroup({
      country: new FormControl(this.service.country, [Validators.required]),
      city: new FormControl(this.service.city, [Validators.required]),
      organization: new FormControl(this.service.organization,),
      certificationAuthorityValidityDays: new FormControl(this.service.certificationAuthorityValidityDays, [Validators.required]),
      certificationServerValidityDays: new FormControl(this.service.certificationServerValidityDays, [Validators.required]),
      certificationUserValidityDays: new FormControl(this.service.certificationUserValidityDays, [Validators.required]),
      length: new FormControl(this.service.length, [Validators.required])
    });
  }
}
