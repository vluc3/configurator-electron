import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {DhcpDnsService} from "../../common/model/dhcp-dns-service";
import {StateService} from "../../common/service/state.service";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {ipValidator, isFormValid, isIpValid} from "../../common/utils/utils";

@Component({
  selector: 'div[dhcpDnsService]',
  templateUrl: './dhcp-dns-service.component.html',
  styleUrls: ['./dhcp-dns-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DhcpDnsServiceComponent implements OnInit {

  @HostBinding('class') clazz = 'dhcp-dns-service';

  dhcpDnsService: DhcpDnsService;
  formGroup: FormGroup;

  constructor(
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
    this.dhcpDnsService = this.stateService.getService('dhcpDnsService') as DhcpDnsService;
    this.formGroup = new FormGroup({
      domainName: new FormControl(this.dhcpDnsService.domainName, [Validators.required]),
      exploitationZone: new FormControl(this.dhcpDnsService.exploitationZone, [Validators.required]),
      administrationZone: new FormControl(this.dhcpDnsService.administrationZone, [Validators.required]),
      dmzZone: new FormControl(this.dhcpDnsService.dmzZone, [Validators.required]),
      dhcpRangeBegin: new FormControl(this.dhcpDnsService.dhcpRangeBegin, [Validators.required]),
      dhcpRangeEnd: new FormControl(this.dhcpDnsService.dhcpRangeEnd, [Validators.required])
    }, {validators: this.checkDnsServers});

    this.dhcpDnsService.defaultDnsServers.forEach((value, index) => {
      this.formGroup.addControl(`server-${index}`, new FormControl(
        value,
        [Validators.required, ipValidator]
      ));
    });
  }

  isValid(key: string): boolean {
    return isFormValid(key, this.formGroup);
  }

  private checkDnsServers: ValidatorFn = (_: AbstractControl): ValidationErrors | null => {
    let error = false;
    for (const dnsServer of this.dhcpDnsService.defaultDnsServers) {
      if (!isIpValid(dnsServer)) {
        error = true;
        break;
      }
    }
    return !error ? null : {invalidDnsServers: true}
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
    if(index !== -1){
      this.dhcpDnsService.defaultDnsServers.splice(index, 1);
      this.formGroup.removeControl(`server-${index}`, {
        emitEvent: true
      });
    }
  }
}
