import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SideNavComponent} from './side-nav/side-nav.component';
import {TopNavComponent} from './top-nav/top-nav.component';
import {MainComponent} from './main/main.component';
import {HostListComponent} from './main/infrastructure/host-list/host-list.component';
import {NetworkComponent} from './main/infrastructure/network/network.component';
import {VirtualMachineComponent} from './main/infrastructure/virtual-machine/virtual-machine.component';
import {ModalComponent} from './common/component/modal/modal.component';
import {ModalDirective} from './common/component/modal/modal.directive';
import {NewHostComponent} from './main/infrastructure/host-list/new-host/new-host.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NewVirtualMachineComponent} from './main/infrastructure/virtual-machine/new-virtual-machine/new-virtual-machine.component';
import {VirtualMachineItemComponent} from './main/infrastructure/virtual-machine/virtual-machine-item/virtual-machine-item.component';
import {HostItemComponent} from './main/infrastructure/virtual-machine/host-item/host-item.component';
import {VirtualMachineItemServiceComponent} from "./main/infrastructure/virtual-machine/virtual-machine-item-service/virtual-machine-item-service.component";
import {DhcpDnsServiceComponent} from './main/service/dhcp-dns-service/dhcp-dns-service.component';
import {NtpServiceComponent} from './main/service/ntp-service/ntp-service.component';
import {MailServiceComponent} from './main/service/mail-service/mail-service.component';
import {ToipWebUiServiceComponent} from './main/service/toip-web-ui-service/toip-web-ui-service.component';
import {EjbcaServiceComponent} from './main/service/ejbca-service/ejbca-service.component';
import {OpenVpnServiceComponent} from './main/service/open-vpn-service/open-vpn-service.component';
import {IpSecServiceComponent} from './main/service/ip-sec-service/ip-sec-service.component';
import {WireGuardServiceComponent} from './main/service/wire-guard-service/wire-guard-service.component';
import {HttpClientModule} from "@angular/common/http";
import {HostListItemComponent} from './main/infrastructure/host-list/host-list-item/host-list-item.component';
import {HomeModalComponent} from './home/home-modal/home-modal.component';
import {NewProjectComponent} from './home/new-project/new-project.component';
import {AppTranslateModule} from "./app-translate.module";
import {FirewallsComponent} from "./main/infrastructure/firewall/firewalls/firewalls.component";
import {FirewallComponent} from "./main/infrastructure/firewall/firewall/firewall.component";
import {ExportComponent} from "./top-nav/export/export.component";
import { MobileIronServiceComponent } from './main/service/mobile-iron-service/mobile-iron-service.component';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    TopNavComponent,
    MainComponent,
    HostListComponent,
    NetworkComponent,
    VirtualMachineComponent,
    ModalComponent,
    ModalDirective,
    NewHostComponent,
    NewVirtualMachineComponent,
    VirtualMachineItemComponent,
    VirtualMachineItemServiceComponent,
    HostItemComponent,
    DhcpDnsServiceComponent,
    NtpServiceComponent,
    MailServiceComponent,
    ToipWebUiServiceComponent,
    EjbcaServiceComponent,
    OpenVpnServiceComponent,
    IpSecServiceComponent,
    WireGuardServiceComponent,
    HostListItemComponent,
    HomeModalComponent,
    NewProjectComponent,
    FirewallsComponent,
    FirewallComponent,
    ExportComponent,
    MobileIronServiceComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppTranslateModule
    // TranslateModule.forRoot({
    //   defaultLanguage: "fr",
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: httpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
