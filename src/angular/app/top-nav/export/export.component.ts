import {Component, EventEmitter, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalBody} from "../../common/component/modal/modal.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {isFormValid, passwordValidator} from "../../common/utils/utils";

@Component({
  selector: 'div[export]',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExportComponent implements ModalBody<any>, OnInit {

  static readonly ANSIBLE_SECRET_VARS = "ansible_secret_vars.yml";
  static readonly ANSIBLE_ESX_VARS = "ansible_esx_vars.yml";
  static readonly ANSIBLE_GLOBAL_VARS = "ansible_global_vars.yml";
  static readonly HOSTS = "hosts";

  @HostBinding("class") clazz = "export";

  data: { password: string };
  formGroup: FormGroup;
  dataValidate = new EventEmitter<{ valid: boolean, data?: { password: string } }>();

  constructor() {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      password: new FormControl(this.data.password, [Validators.required]),
      passwordConfirmation: new FormControl(this.data.password)
    });

    this.formGroup.addValidators(passwordValidator("password", this.formGroup));

    this.formGroup.statusChanges.subscribe(status => {
      const valid = status === 'VALID';
      if (valid) {
        this.data.password = this.formGroup.getRawValue().password;
      }
      this.dataValidate.next({valid, data: this.data});
    });
  }

  isValid(key: string): boolean {
    return isFormValid(key, this.formGroup);
  }

}
