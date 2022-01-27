import {Directive, OnInit} from '@angular/core';
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {FormGroup} from "@angular/forms";
import {copyEntries, isFormValid} from "../../../common/utils/utils";
import {Service} from "../../../common/model/service";
import {CoreComponent} from './core-component';

@Directive()
export abstract class ServiceComponent extends CoreComponent implements OnInit {

  formGroup: FormGroup;
  abstract service: Service;

  protected constructor(
    protected stateService: StateService,
    protected modalService: ModalService,
    protected translateService: TranslateService,
    protected key: string
  ) {
    super();
  }

  ngOnInit(): void {
    this.init();
    this.initValid();
  }

  isValid(key: string): boolean {
    return isFormValid(key, this.formGroup);
  }

  reset() {
    this.modalService.open({
      title: "RESET",
      html: `<p class="text-danger">${this.translateService.instant("SERVICE.RESET_QUESTION")}</p>`,
    }).subscribe(close => {
      if (!close.cancel) {
        this.init();
        this.initValid();
      }
    });
  }

  protected save() {
    this.copyFromFormGroup();
    this.stateService.setService(this.key, this.service);
  }

  private initValid() {
    this.formGroup.statusChanges
      .subscribe(status => {
      if (status === 'VALID') {
        this.save();
      }
    });
  }

  protected copyFromFormGroup() {
    copyEntries(this.service, this.formGroup.getRawValue());
  }

  protected abstract init(): void;
}
