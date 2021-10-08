import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {ToipWebUiService} from "../../../common/model/toip-web-ui-service";
import {ServiceComponent} from "../abstract/service.component";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {clone, copyEntries} from "../../../common/utils/utils";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'div[toipWebUiService]',
  templateUrl: './toip-web-ui-service.component.html',
  styleUrls: ['./toip-web-ui-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToipWebUiServiceComponent extends ServiceComponent {

  @HostBinding('class') clazz = 'toip-web-ui-service service';

  service: ToipWebUiService;

  constructor(
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "toipWebUiService");
  }

  protected init(): void {
    this.service = clone(this.stateService.getService(this.key)) as ToipWebUiService;
    this.formGroup = new FormGroup({
      domainName: new FormControl(this.service.domainName, [Validators.required]),
      webPort: new FormControl(this.service.webPort, [Validators.required]),
      interfacePort: new FormControl(this.service.interfacePort,),
      externSipPort: new FormControl(this.service.externSipPort, [Validators.required]),
      internSipPort: new FormControl(this.service.internSipPort, [Validators.required]),
      externOpenSipPort: new FormControl(this.service.externOpenSipPort, [Validators.required]),
      internOpenSipPort: new FormControl(this.service.internOpenSipPort, [Validators.required])
    });
  }
}
