import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {DhcpDnsService} from "../../../common/model/dhcp-dns-service";
import {StateService} from "../../../common/service/state.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {clone, copyEntries, ipValidator, isFormValid} from "../../../common/utils/utils";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'div[dhcpDnsService]',
  templateUrl: './dhcp-dns-service.component.html',
  styleUrls: ['./dhcp-dns-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DhcpDnsServiceComponent implements OnInit {

  @HostBinding('class') clazz = 'dhcp-dns-service service';

  dhcpDnsService: DhcpDnsService;
  formGroup: FormGroup;
  valid = false;

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
    this.dhcpDnsService = clone(this.stateService.getService('dhcpDnsService')) as DhcpDnsService;
    this.formGroup = new FormGroup({
      domainName: new FormControl(this.dhcpDnsService.domainName, [Validators.required]),
      exploitationZone: new FormControl(this.dhcpDnsService.exploitationZone, [Validators.required]),
      administrationZone: new FormControl(this.dhcpDnsService.administrationZone, [Validators.required]),
      dmzZone: new FormControl(this.dhcpDnsService.dmzZone, [Validators.required]),
      dhcpRangeBegin: new FormControl(this.dhcpDnsService.dhcpRangeBegin, [Validators.required, ipValidator]),
      dhcpRangeEnd: new FormControl(this.dhcpDnsService.dhcpRangeEnd, [Validators.required, ipValidator])
    }/*, {validators: this.checkDnsServers}*/);

    this.dhcpDnsService.defaultDnsServers.forEach((value, index) => {
      this.formGroup.addControl(`server-${index}`, new FormControl(
        value,
        [Validators.required, ipValidator]
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

  add() {
    let server = '';
    this.formGroup.addControl(`server-${this.dhcpDnsService.defaultDnsServers.length}`, new FormControl(
      server,
      [Validators.required, ipValidator]
    ), {
      emitEvent: true
    });
    this.dhcpDnsService.defaultDnsServers.push(server);
  }

  remove(server: string) {
    const index = this.dhcpDnsService.defaultDnsServers.indexOf(server);
    if (index !== -1) {
      this.dhcpDnsService.defaultDnsServers.splice(index, 1);
      this.formGroup.removeControl(`server-${index}`, {
        emitEvent: true
      });
    }
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
      const ignore = this.dhcpDnsService.defaultDnsServers.map((value, index) => `server-${index}`);
      copyEntries(this.dhcpDnsService, this.formGroup.getRawValue(), {ignore})
      ignore.forEach((key, index) => {
        this.dhcpDnsService.defaultDnsServers[index] = this.formGroup.getRawValue()[key];
      });
      this.stateService.setService("dhcpDnsService", this.dhcpDnsService);
    }
  }
}
