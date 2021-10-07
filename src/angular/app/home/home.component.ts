import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalBody} from "../common/component/modal/modal.component";

@Component({
  selector: 'div[home]',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements ModalBody<any>, OnInit {

  @HostBinding("class") clazz = "home";

  data: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
