import {Component, OnInit} from '@angular/core';
import {EjbcaService} from "../../common/model/ejbca-service";

@Component({
  selector: 'div[ejbcaService]',
  templateUrl: './ejbca-service.component.html',
  styleUrls: ['./ejbca-service.component.scss']
})
export class EjbcaServiceComponent implements OnInit {

  ejbcaService: EjbcaService;

  constructor() {
  }

  ngOnInit(): void {
  }

}
