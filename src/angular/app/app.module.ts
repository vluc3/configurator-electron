import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SideNavComponent} from './side-nav/side-nav.component';
import {TopNavComponent} from './top-nav/top-nav.component';
import {MainComponent} from './main/main.component';
import {HostListComponent} from './main/host-list/host-list.component';
import {NetworkComponent} from './main/network/network.component';
import {VirtualMachineComponent} from './main/virtual-machine/virtual-machine.component';
import {ModalComponent} from './common/component/modal/modal.component';
import {ModalDirective} from './common/component/modal/modal.directive';
import {HostComponent} from './main/host-list/host/host.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HostVirtualMachineComponent} from "./main/host-list/virtual-machine/host-virtual-machine.component";
import {NewVirtualMachineComponent} from './main/virtual-machine/new-virtual-machine/new-virtual-machine.component';
import {VirtualMachineItemComponent} from './main/virtual-machine/virtual-machine-item/virtual-machine-item.component';
import {HostItemComponent} from './main/virtual-machine/host-item/host-item.component';
import {VirtualMachineItemServiceComponent} from "./main/virtual-machine/virtual-machine-item-service/virtual-machine-item-service.component";
import { DhcpDnsServiceComponent } from './main/dhcp-dns-service/dhcp-dns-service.component';
import { NtpServiceComponent } from './main/ntp-service/ntp-service.component';
import { MailServiceComponent } from './main/mail-service/mail-service.component';
import { ToipWebUiServiceComponent } from './main/toip-web-ui-service/toip-web-ui-service.component';
import { EjbcaServiceComponent } from './main/ejbca-service/ejbca-service.component';
import { OpenVpnServiceComponent } from './main/open-vpn-service/open-vpn-service.component';
import { IpSecServiceComponent } from './main/ip-sec-service/ip-sec-service.component';

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
    HostComponent,
    HostVirtualMachineComponent,
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
    IpSecServiceComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
