import {Component, EventEmitter, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalBody} from "../../../../common/component/modal/modal.component";
import {Host} from "../../../../common/model/host";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {copyEntries, ipValidator, isFormValid, keypressRegex, passwordValidator} from "../../../../common/utils/utils";

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
      ]),
      password: new FormControl(this.data?.password, [
          Validators.required
        ]
      ),
      passwordConfirmation: new FormControl(this.data?.password),
      datastore: new FormControl(this.data?.datastore, [Validators.required])
    });

    this.formGroup.addValidators(passwordValidator("password", this.formGroup));

    this.formGroup.statusChanges.subscribe(status => {
      const valid = status === 'VALID';
      if (valid) {
        copyEntries(this.data, this.formGroup.getRawValue(), {ignore: ["passwordConfirmation"]});
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

  //
  // private checkPasswords: ValidatorFn = (_: AbstractControl): ValidationErrors | null => {
  //   const password = this.formGroup?.get('password')?.value;
  //   const passwordConfirmation = this.formGroup?.get('passwordConfirmation')?.value
  //   return password && passwordConfirmation && password === passwordConfirmation ? null : {passwordConfirmation: true}
  // }
}
