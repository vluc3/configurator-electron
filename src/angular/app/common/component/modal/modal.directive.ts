import {
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewContainerRef
} from '@angular/core';
import {ModalBody} from "./modal.component";

@Directive({
  selector: '[modalBody]'
})
export class ModalDirective implements OnInit {

  @Input() component?: Type<ModalBody<any>>;
  @Input() data: any;
  @Output() dataValidate = new EventEmitter<{ valid: boolean, data?: any }>();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit(): void {
    if (!this.component) {
      return;
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<ModalBody<any>>(this.component);
    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(componentFactory);
    componentRef.instance.data = this.data;
    if (componentRef.instance.dataValidate) {
      componentRef.instance.dataValidate.subscribe(value => this.dataValidate.next(value));
    } else {
      this.dataValidate.next({valid: true});
      this.dataValidate.complete();
    }
  }
}

