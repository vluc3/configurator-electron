import {Component, OnInit} from '@angular/core';
import {NtpService} from "../../common/model/ntp-service";

@Component({
  selector: 'div[ntpService]',
  templateUrl: './ntp-service.component.html',
  styleUrls: ['./ntp-service.component.scss']
})
export class NtpServiceComponent implements OnInit {

  ntpService: NtpService;

  constructor() {
  }

  ngOnInit(): void {
  }

}
