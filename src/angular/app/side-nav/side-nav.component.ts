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
export class SideNavComponent implements OnInit {

  @HostBinding("class") clazz = "side-nav bg-dark text-white";

  menu = [{
    title: "Infrastructure",
    items: [{
      name: "Infrastructure",
      icon: "cfg-server",
      link: "infrastructure/host"
    }, {
      name: "Machines virtuelles",
      icon: "cfg-cubes",
      link: "infrastructure/vm"
    }, {
      name: "Réseau",
      icon: "cfg-network-wired",
      link: "infrastructure/network"
    }]
  }, {
    title: "Service",
    items: [{
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
    }]
  }];

  constructor(
    private stateService: StateService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  get projectName(): string {
    return this.stateService.getCurrent().name;
  }

  isActive(link: Link): boolean {
    return `/${link.link}` === this.router.url;
  }
}

interface Link extends Service {
  link: string;
}
