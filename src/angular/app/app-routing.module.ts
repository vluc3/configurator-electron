import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HostListComponent} from "./main/infrastructure/host-list/host-list.component";
import {NetworkComponent} from "./main/infrastructure/network/network.component";
import {VirtualMachineComponent} from "./main/infrastructure/virtual-machine/virtual-machine.component";
import {DhcpDnsServiceComponent} from "./main/service/dhcp-dns-service/dhcp-dns-service.component";
import {NtpServiceComponent} from "./main/service/ntp-service/ntp-service.component";
import {MailServiceComponent} from "./main/service/mail-service/mail-service.component";
import {ToipWebUiServiceComponent} from "./main/service/toip-web-ui-service/toip-web-ui-service.component";
import {EjbcaServiceComponent} from "./main/service/ejbca-service/ejbca-service.component";
import {OpenVpnServiceComponent} from "./main/service/open-vpn-service/open-vpn-service.component";
import {IpSecServiceComponent} from "./main/service/ip-sec-service/ip-sec-service.component";
import {FirewallComponent} from "./main/infrastructure/firewall/firewall.component";

const routes: Routes = [{
  path: 'infrastructure/host',
  component: HostListComponent
}, {
  path: 'infrastructure/network',
  component: NetworkComponent
}, {
  path: 'infrastructure/firewall',
  component: FirewallComponent
}, {
  path: 'infrastructure/vm',
  component: VirtualMachineComponent
}, {
  path: '',
  redirectTo: 'infrastructure/host',
  pathMatch: "full"
}, {
  path: 'service/dns-dhcp',
  component: DhcpDnsServiceComponent
}, {
  path: 'service/ntp',
  component: NtpServiceComponent
}, {
  path: 'service/mail',
  component: MailServiceComponent
}, {
  path: 'service/toip-web-ui',
  component: ToipWebUiServiceComponent
}, {
  path: 'service/ejbca',
  component: EjbcaServiceComponent
}, {
  path: 'service/openvpn',
  component: OpenVpnServiceComponent
}, {
  path: 'service/ip-sec',
  component: IpSecServiceComponent
}];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
        useHash: true
      })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
