import {Component, EventEmitter, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalBody} from "../../../../common/component/modal/modal.component";
import {Host} from "../../../../common/model/host";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {copyEntries, ipValidator, isFormValid, keypressRegex} from "../../../../common/utils/utils";

@Component({
  selector: 'div[newHost]',
  templateUrl: './new-host.component.html',
  styleUrls: ['./new-host.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewHostComponent implements ModalBody<Host>, OnInit {

  @HostBinding('class') clazz = 'host';
  data: Host;
  formGroup: FormGroup;
  dataValidate = new EventEmitter<{ valid: boolean, data?: Host }>();

  constructor() {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl(this.data?.name, [Validators.required]),
      type: new FormControl(this.data?.network, [Validators.required]),
      ip: new FormControl(this.data?.ip, [
        Validators.required,
        ipValidator
        // ,
        // Validators.pattern(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm)
      ]),
      password: new FormControl(this.data?.password, [
          Validators.required
        ]
      ),
      passwordConfirmation: new FormControl(this.data?.password),
      datastore: new FormControl(this.data?.name, [Validators.required])
    }, {validators: this.checkPasswords});

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

  ipKeypress(event: KeyboardEvent): boolean {
    return keypressRegex(event, '^[0-9\.]+$');
  }

  private checkPasswords: ValidatorFn = (_: AbstractControl): ValidationErrors | null => {
    const password = this.formGroup?.get('password')?.value;
    const passwordConfirmation = this.formGroup?.get('passwordConfirmation')?.value
    return password && passwordConfirmation && password === passwordConfirmation ? null : {passwordConfirmation: true}
  }
}
