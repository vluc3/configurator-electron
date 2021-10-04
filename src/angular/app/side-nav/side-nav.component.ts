import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {StateService} from "../common/service/state.service";
import {Service} from "../common/model/service";

@Component({
  selector: 'nav[sideNav]',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideNavComponent implements OnInit {

  @HostBinding("class") clazz = "side-nav bg-dark text-white";

  constructor(
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
  }

  get services(): ServiceLink[] {
    return [{
      name: 'DNS/DHCP',
      icon: 'cfg-globe',
      link: 'service/dns-dhcp'
    }, {
      name: 'NTP',
      icon: 'cfg-network-time',
      link: 'service/ntp'
    }, {
      name: 'Mails',
      icon: 'cfg-envelope',
      link: 'service/mail'
    }, {
      name: 'TOIP/Web UI',
      icon: 'cfg-phone-office',
      link: 'service/toip-web-ui'
    }, {
      name: 'EJBCA',
      icon: 'cfg-file-certificate',
      link: 'service/ejbca'
    }, {
      name: 'OpenVPN',
      icon: 'cfg-openvpn',
      link: 'service/openvpn'
    }, {
      name: 'IPSec',
      icon: 'cfg-ip-lock',
      link: 'service/ip-sec'
    }];
  }

  get projectName(): string {
    return this.stateService.getStore().name;
  }
}

interface ServiceLink extends Service {
  link: string;
}
