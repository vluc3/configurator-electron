import { Component, OnInit } from '@angular/core';
import {OpenVpnService} from "../../common/model/open-vpn-service";

@Component({
  selector: 'div[openVpnService]',
  templateUrl: './open-vpn-service.component.html',
  styleUrls: ['./open-vpn-service.component.scss']
})
export class OpenVpnServiceComponent implements OnInit {

  openVpnService: OpenVpnService;

  constructor() { }

  ngOnInit(): void {
  }

}
