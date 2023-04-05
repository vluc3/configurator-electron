import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {DhcpDnsService} from "../../../common/model/dhcp-dns-service";
import {StateService} from "../../../common/service/state.service";
import {FormBuilder, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
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
    private formBuilder: FormBuilder,
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "dhcpDnsService");
  }

  get defaultDnsServerFormArray(): FormArray {
    return <FormArray> this.formGroup.get('defaultDnsServers');
  }

  protected init(): void {
    this.service = clone(this.stateService.getService('dhcpDnsService')) as DhcpDnsService;

    this.formGroup = new FormGroup({
      domainName: new FormControl(this.service.domainName, [Validators.required]),
      exploitationZone: new FormControl(this.service.exploitationZone, [Validators.required]),
      dmzZone: new FormControl(this.service.dmzZone, [Validators.required]),
      dhcpRangeBegin: new FormControl(this.service.dhcpRangeBegin, [Validators.required, ipValidator]),
      dhcpRangeEnd: new FormControl(this.service.dhcpRangeEnd, [Validators.required, ipValidator]),
      defaultDnsServers: new FormArray([])
    });

    this.addDefaultDnsServers();
  }

  addDefaultDnsServers() {
    for (const defaultDnsServer of this.service.defaultDnsServers) {
      this.addDefaultDnsServer(defaultDnsServer);
    }
  }

  addDefaultDnsServer(defaultDnsServer?: string) {
    const defaultDnsServerformGroup: FormGroup = this.formBuilder.group({
      defaultDnsServer: [defaultDnsServer, [Validators.required, ipValidator]]
    });

    this.defaultDnsServerFormArray.push(defaultDnsServerformGroup);
  }

  removeDefaultDnsServer(index: number) {
    this.defaultDnsServerFormArray.removeAt(index);
  }

  protected copyFromFormGroup() {
    const rawValue: any = this.formGroup.getRawValue();

    rawValue.defaultDnsServers = rawValue.defaultDnsServers.map((defaultDnsServer: any) => {
      return defaultDnsServer['defaultDnsServer'];
    });

    copyEntries(this.service, rawValue);
  }
}
