import {Component, OnInit} from '@angular/core';
import {IpSecService} from "../../common/model/ip-sec-service";

@Component({
  selector: 'div[ipSecService]',
  templateUrl: './ip-sec-service.component.html',
  styleUrls: ['./ip-sec-service.component.scss']
})
export class IpSecServiceComponent implements OnInit {

  ipSecService: IpSecService;

  constructor() {
  }

  ngOnInit(): void {
  }

}
