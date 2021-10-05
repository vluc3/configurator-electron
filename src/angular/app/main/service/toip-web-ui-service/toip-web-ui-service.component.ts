import { Component, OnInit } from '@angular/core';
import {ToipWebUiService} from "../../../common/model/toip-web-ui-service";

@Component({
  selector: 'div[toipWebUiService]',
  templateUrl: './toip-web-ui-service.component.html',
  styleUrls: ['./toip-web-ui-service.component.scss']
})
export class ToipWebUiServiceComponent implements OnInit {

  toipWebUiService: ToipWebUiService;

  constructor() { }

  ngOnInit(): void {
  }

}
