import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {NtpService} from "../../../common/model/ntp-service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {clone, ipValidator, isFormValid} from "../../../common/utils/utils";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'div[ntpService]',
  templateUrl: './ntp-service.component.html',
  styleUrls: ['./ntp-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NtpServiceComponent implements OnInit {

  @HostBinding('class') clazz = 'ntp-service service';

  formGroup: FormGroup;
  valid = false;
  ntpService: NtpService;

  constructor(
    private stateService: StateService,
    private modalService: ModalService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.ntpService = clone(this.stateService.getService('ntpService')) as NtpService;
    this.formGroup = new FormGroup({});

    this.ntpService.communicationSystemNtpServer.forEach((value, index) => {
      this.formGroup.addControl(`c-ntp-server-${index}`, new FormControl(
        value,
        [Validators.required/*, ipValidator*/]
      ));
    });

    this.ntpService.defaultNtpServers.forEach((value, index) => {
      this.formGroup.addControl(`d-ntp-server-${index}`, new FormControl(
        value,
        [Validators.required/*, ipValidator*/]
      ));
    });

    this.formGroup.statusChanges.subscribe(status => {
      this.valid = status === 'VALID';
    });
    this.valid = this.formGroup.status === "VALID";
  }

  isValid(key: string): boolean {
    return isFormValid(key, this.formGroup);
  }

  reset() {
    this.modalService.open({
      title: "RESET",
      html: `<p class="text-danger">${this.translateService.instant("SERVICE.RESET_QUESTION")}</p>`,
    }).subscribe(close => {
      if (!close.cancel) {
        this.init();
      }
    });
  }

  save() {
    if (this.formGroup.status === "VALID") {
      // const ignore = this.dhcpDnsService.defaultDnsServers.map((value, index) => `server-${index}`);
      // copyEntries(this.dhcpDnsService, this.formGroup.getRawValue(), {ignore})
      // ignore.forEach((key, index) => {
      //   this.dhcpDnsService.defaultDnsServers[index] = this.formGroup.getRawValue()[key];
      // });
      // this.stateService.setService("dhcpDnsService", this.dhcpDnsService);
    }
  }

  add(key: "defaultNtpServers" | "communicationSystemNtpServer") {
    let server = '';
    this.formGroup.addControl(
      `${key === "defaultNtpServers" ? "d" : "c"}-ntp-server-${this.ntpService[key].length}`,
      new FormControl(
        server,
        [Validators.required/*, ipValidator*/]
      ), {
        emitEvent: true
      });
    this.ntpService[key].push(server);
  }

  remove(key: "defaultNtpServers" | "communicationSystemNtpServer", server: string) {
    const index = this.ntpService[key].indexOf(server);
    if (index !== -1) {
      this.ntpService[key].splice(index, 1);
      this.formGroup.removeControl(
        `${key === "defaultNtpServers" ? "d" : "c"}-ntp-server-${index}`,
        {
          emitEvent: true
        }
      );
    }
  }
}
