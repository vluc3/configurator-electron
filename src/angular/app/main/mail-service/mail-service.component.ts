import { Component, OnInit } from '@angular/core';
import {MailService} from "../../common/model/mail-service";

@Component({
  selector: 'div[mailService]',
  templateUrl: './mail-service.component.html',
  styleUrls: ['./mail-service.component.scss']
})
export class MailServiceComponent implements OnInit {

  mailService: MailService

  constructor() { }

  ngOnInit(): void {
  }

}
