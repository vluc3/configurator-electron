import {Component, HostBinding, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'body[app]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @HostBinding("class") clazz = "app";
}
