import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {StateService} from "../common/service/state.service";
import {Service} from "../common/model/service";
import {Router} from "@angular/router";

@Component({
  selector: 'nav[sideNav]',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideNavComponent {

  @HostBinding("class") clazz = "side-nav bg-dark text-white";

  menu = [{
    title: "SIDE_NAV.INFRASTRUCTURE",
    items: [{
      name: "SIDE_NAV.HOSTS",
      icon: "cfg-server",
      link: "infrastructure/host"
    }, {
      name: "SIDE_NAV.FIREWALL",
      icon: "cfg-firewall",
      link: "infrastructure/firewalls"
    }, {
      name: "SIDE_NAV.VIRTUAL_MACHINES",
      icon: "cfg-cubes",
      link: "infrastructure/vm"
    }, {
      name: "SIDE_NAV.NETWORK",
      icon: "cfg-network-wired",
      link: "infrastructure/network"
    }]
  }, {
    title: "SIDE_NAV.SERVICE",
    items: [{
      name: 'SIDE_NAV.DNS_DHCP',
      icon: 'cfg-globe',
      link: 'service/dns-dhcp'
    }, {
      name: 'SIDE_NAV.NTP',
      icon: 'cfg-network-time',
      link: 'service/ntp'
    }, {
      name: 'SIDE_NAV.MAILS',
      icon: 'cfg-envelope',
      link: 'service/mail'
    }, {
      name: 'SIDE_NAV.TOIP_WEB_UI',
      icon: 'cfg-phone-office',
      link: 'service/toip-web-ui'
    }, {
      name: 'SIDE_NAV.EJBCA',
      icon: 'cfg-file-certificate',
      link: 'service/ejbca'
    }, {
      name: 'SIDE_NAV.OPEN_VPN',
      icon: 'cfg-openvpn',
      link: 'service/openvpn'
    }, {
      name: 'SIDE_NAV.IP_SEC',
      icon: 'cfg-ip-lock',
      link: 'service/ip-sec'
    }, {
      name: 'SIDE_NAV.WIRE_GUARD',
      icon: 'cfg-wire-guard',
      link: 'service/wire-guard'
    }, {
      name: 'SIDE_NAV.MOBILE_IRON',
      icon: 'cfg-mobile-iron',
      link: 'service/mobile-iron'
    }]
  }];

  constructor(
    private stateService: StateService,
    private router: Router
  ) {
  }

  get projectName(): string {
    return this.stateService.getCurrent().name;
  }

  isActive(link: string): boolean {
    return `/${link}` === this.router.url;
  }
}
