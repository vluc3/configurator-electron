import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {NtpService} from "../../../common/model/ntp-service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {clone} from "../../../common/utils/utils";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {ServiceComponent} from "../abstract/service.component";

@Component({
  selector: 'div[ntpService]',
  templateUrl: './ntp-service.component.html',
  styleUrls: ['./ntp-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NtpServiceComponent extends ServiceComponent {

  @HostBinding('class') clazz = 'ntp-service service';

  service: NtpService;

  constructor(
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "ntpService");
  }

  protected init(): void {
    this.service = clone(this.stateService.getService('ntpService')) as NtpService;
    this.formGroup = new FormGroup({});

    this.service.defaultNtpServers.forEach((value, index) => {
      this.formGroup.addControl(`ntp-server-${index}`, new FormControl(
        value,
        [Validators.required/*, ipValidator*/]
      ));
    });
  }

  add() {
    let server = '';
    this.formGroup.addControl(
      `ntp-server-${this.service.defaultNtpServers.length}`,
      new FormControl(
        server,
        [Validators.required/*, ipValidator*/]
      ), {
        emitEvent: true
      });
    this.service.defaultNtpServers.push(server);
  }

  remove(server: string) {
    const index = this.service.defaultNtpServers.indexOf(server);
    if (index !== -1) {
      this.service.defaultNtpServers.splice(index, 1);
      this.formGroup.removeControl(
        `ntp-server-${index}`,
        {
          emitEvent: true
        }
      );
    }
  }

  protected copyFromFormGroup() {
    for (let index = 0; index < this.service.defaultNtpServers.length; index++) {
      this.service.defaultNtpServers[index] = this.formGroup.controls[`ntp-server-${index}`].value;
    }
  }
}
