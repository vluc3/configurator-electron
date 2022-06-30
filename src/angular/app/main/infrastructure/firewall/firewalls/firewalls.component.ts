import {Component, HostBinding, ViewEncapsulation, AfterViewInit, ViewChild, ViewChildren} from "@angular/core";
import {Firewalls, StateService} from "../../../../common/service/state.service";
import {FormGroup} from "@angular/forms";

import { Firewall } from "../../../../common/model/firewall";
import { FirewallComponent } from "../firewall/firewall.component";
import { FirewallService } from "../firewall.service";

import { isNetworkValid } from "../../../../common/utils/utils";

@Component({
  selector: "div[firewalls]",
  templateUrl: "./firewalls.component.html",
  styleUrls: ["./firewalls.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FirewallsComponent implements AfterViewInit {

  @HostBinding('class') clazz = 'firewall service';
  stormshieldFormGroup: FormGroup;

  @ViewChild('stormshield')
  stormshieldFirewallComponent: FirewallComponent;

  @ViewChild('pfsense')
  pfsenseFirewallComponent: FirewallComponent;

  constructor(
    private stateService: StateService,
    private firewallService: FirewallService) {
  }

  get firewalls(): Firewalls {
    return this.stateService.getCurrent().firewalls;
  }

  get stormshieldFirewall(): Firewall {
    return this.firewalls.stormshield;
  }

  set stormshieldFirewall(value: Firewall) {
    this.firewalls.stormshield = {...value};
  }

  get pfsenseFirewall(): Firewall {
    return this.firewalls.pfsense;
  }

  set pfsenseFirewall(value: Firewall) {
    this.firewalls.pfsense = {...value};
  }

  ngAfterViewInit(): void {
    this.stormshieldFirewallComponent.onUpdated.subscribe((stormshieldFirewall: Firewall) => {
      this.stormshieldFirewall = stormshieldFirewall;
      this.firewallService.networkValid = isNetworkValid(this.pfsenseFirewall.inputIp, stormshieldFirewall.outputIp);
    });

    this.pfsenseFirewallComponent.onUpdated.subscribe((pfsenseFirewall: Firewall) => {
      this.pfsenseFirewall = pfsenseFirewall;
      this.firewallService.networkValid = isNetworkValid(pfsenseFirewall.inputIp, this.stormshieldFirewall.outputIp);
    });
  }
}
