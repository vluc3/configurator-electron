import {Component, EventEmitter, HostBinding, OnInit} from '@angular/core';
import {ModalBody} from "../../common/component/modal/modal.component";
import {StateService} from "../../common/service/state.service";
import {ModalService} from "../../common/component/modal/modal.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {copyEntries, isFormValid} from "../../common/utils/utils";

@Component({
  selector: 'div[newProject]',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements ModalBody<any>, OnInit {

  @HostBinding("class") clazz = "new-project";

  data: Project;
  formGroup: FormGroup;
  dataValidate = new EventEmitter<{ valid: boolean, data?: Project }>();

  constructor(
    private stateService: StateService,
    private modalService: ModalService
  ) {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl(this.data?.name, [Validators.required])
    });

    this.formGroup.statusChanges.subscribe(status => {
      const valid = status === 'VALID';
      if (valid) {
        copyEntries(this.data, this.formGroup.getRawValue());
      }
      this.dataValidate.next({valid, data: this.data});
    });
  }

  isValid(key: string): boolean {
    return isFormValid(key, this.formGroup);
  }

}

export interface Project {
  name: string;
  file?: string;
}
