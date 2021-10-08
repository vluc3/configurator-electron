import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {DhcpDnsService} from "../../../common/model/dhcp-dns-service";
import {StateService} from "../../../common/service/state.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {clone, copyEntries, ipValidator} from "../../../common/utils/utils";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {ServiceComponent} from "../abstract/service.component";

@Component({
  selector: 'div[dhcpDnsService]',
  templateUrl: './dhcp-dns-service.component.html',
  styleUrls: ['./dhcp-dns-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DhcpDnsServiceComponent extends ServiceComponent {

  @HostBinding('class') clazz = 'dhcp-dns-service service';

  service: DhcpDnsService;

  constructor(
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "dhcpDnsService");
  }

  protected init(): void {
    this.service = clone(this.stateService.getService('dhcpDnsService')) as DhcpDnsService;
    this.formGroup = new FormGroup({
      domainName: new FormControl(this.service.domainName, [Validators.required]),
      exploitationZone: new FormControl(this.service.exploitationZone, [Validators.required]),
      administrationZone: new FormControl(this.service.administrationZone, [Validators.required]),
      dmzZone: new FormControl(this.service.dmzZone, [Validators.required]),
      dhcpRangeBegin: new FormControl(this.service.dhcpRangeBegin, [Validators.required, ipValidator]),
      dhcpRangeEnd: new FormControl(this.service.dhcpRangeEnd, [Validators.required, ipValidator])
    });
    this.service.defaultDnsServers.forEach((value, index) => {
      this.formGroup.addControl(`server-${index}`, new FormControl(
        value,
        [Validators.required, ipValidator]
      ));
    });
  }

  add() {
    let server = '';
    this.formGroup.addControl(`server-${this.service.defaultDnsServers.length}`, new FormControl(
      server,
      [Validators.required, ipValidator]
    ), {
      emitEvent: true
    });
    this.service.defaultDnsServers.push(server);
  }

  remove(server: string) {
    const index = this.service.defaultDnsServers.indexOf(server);
    if (index !== -1) {
      this.service.defaultDnsServers.splice(index, 1);
      this.formGroup.removeControl(`server-${index}`, {
        emitEvent: true
      });
    }
  }

  protected copyFromFormGroup() {
    const ignore = this.service.defaultDnsServers.map((value, index) => `server-${index}`);
    copyEntries(this.service, this.formGroup.getRawValue(), {ignore})
    ignore.forEach((key, index) => {
      this.service.defaultDnsServers[index] = this.formGroup.getRawValue()[key];
    });
  }
}
