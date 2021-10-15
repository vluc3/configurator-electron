import {Component, EventEmitter, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalBody} from "../../../../common/component/modal/modal.component";
import {VirtualMachine} from "../../../../common/model/virtual-machine";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {
  copyEntries,
  ipValidator,
  isFormValid,
  isIpValid, isMaskValid,
  isNetworkValid,
  keypressRegex
} from "../../../../common/utils/utils";

@Component({
  selector: 'div[newVirtualMachine]',
  templateUrl: './new-virtual-machine.component.html',
  styleUrls: ['./new-virtual-machine.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewVirtualMachineComponent implements ModalBody<VirtualMachine>, OnInit {

  @HostBinding('class') clazz = 'new-virtual-machine';

  data: VirtualMachine;
  formGroup: FormGroup;
  dataValidate = new EventEmitter<{ valid: boolean, data?: VirtualMachine }>();

  constructor() {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl(this.data.name, [Validators.required]),
      ip: new FormControl(this.data.ip, [
        Validators.required,
        ipValidator
      ]),
      mask: new FormControl(this.data.mask, [
        Validators.required,
        ipValidator,
        this.maskValidator
      ]),
      gateway: new FormControl(this.data.gateway, [
        ipValidator
      ]),
    }, {validators: this.checkIps});

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

  maskValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    if (!isMaskValid(value)) {
      return {maskNotValid: {value}};
    }
    return null;
  }

  private checkIps: ValidatorFn = (_: AbstractControl): ValidationErrors | null => {
    if (!this.formGroup) {
      return null;
    }
    if (this.formGroup.get('ip').errors || this.formGroup.get('mask').errors || !this.formGroup.get('gateway').value) {
      return null;
    }
    if (!isNetworkValid(
      this.formGroup.get('ip').value,
      this.formGroup.get('mask').value,
      this.formGroup.get('gateway').value
    )) {
      return {ipError: true};
    }

    return null;
  }

}
