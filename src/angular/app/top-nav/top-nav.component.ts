import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'div[topNav]',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopNavComponent implements OnInit {

  @HostBinding("class") clazz = "top-nav";

  constructor() { }

  ngOnInit(): void {
  }

}
