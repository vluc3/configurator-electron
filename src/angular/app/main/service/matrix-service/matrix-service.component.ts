import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {MatrixService} from "../../../common/model/matrix-service";
import {ServiceComponent} from "../abstract/service.component";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {clone} from "../../../common/utils/utils";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'div[matrixService]',
  templateUrl: './matrix-service.component.html',
  styleUrls: ['./matrix-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MatrixServiceComponent extends ServiceComponent {

  @HostBinding('class') clazz = 'matrix-service service';

  service: MatrixService;

  constructor(
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "matrixService");
  }

  protected init(): void {
    this.service = clone(this.stateService.getService(this.key)) as MatrixService;
    this.formGroup = new FormGroup({
      port: new FormControl(this.service.port, [Validators.required]),
    });
  }
}
