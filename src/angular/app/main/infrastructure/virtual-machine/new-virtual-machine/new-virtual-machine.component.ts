import {Component, EventEmitter, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalBody} from "../../../../common/component/modal/modal.component";
import {VirtualMachine} from "../../../../common/model/virtual-machine";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {
  copyEntries,
  ipValidator,
  isFormValid,
  isMaskValid,
  isNetworkValid,
  maskIpValidator,
} from "../../../../common/utils/utils";

import {CoreComponent} from '../../../service/abstract/core-component';
import { StateService } from '../../../../common/service/state.service';
import { OperatingSystemEnum } from '../../../../common/model/operating-system.enum';

@Component({
  selector: 'div[newVirtualMachine]',
  templateUrl: './new-virtual-machine.component.html',
  styleUrls: ['./new-virtual-machine.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewVirtualMachineComponent extends CoreComponent implements ModalBody<VirtualMachine>, OnInit {

  @HostBinding('class') clazz = 'new-virtual-machine';

  data: VirtualMachine;
  formGroup: FormGroup;
  dataValidate = new EventEmitter<{ valid: boolean, data?: VirtualMachine }>();

  operatingSystemValid: boolean = true;

  constructor(
    private stateService: StateService) {
      super();
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
        maskIpValidator,
        this.maskValidator
      ]),
      operatingSystem: new FormControl(this.data.operatingSystem, [
        Validators.required,
      ]),
      gateway: new FormControl(this.data.gateway, [
        ipValidator
      ]),
    }, {validators: this.checkIps});

    this.formGroup.statusChanges.subscribe(status => {
      let valid = status === 'VALID';

      if (valid) {
        const operatingSystem: OperatingSystemEnum = this.formGroup.get('operatingSystem').value;
        this.operatingSystemValid = this.stateService.serviceIdsOperatingSystemMatches(this.data.services, operatingSystem);
        valid = this.operatingSystemValid;
      }

      if (valid) {
        copyEntries(this.data, this.formGroup.getRawValue());
      }

      this.dataValidate.next({valid, data: this.data});
    });
  }

  isValid(key: string): boolean {
    return isFormValid(key, this.formGroup);
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
      this.formGroup.get('gateway').value,
      this.formGroup.get('mask').value,
    )) {
      return {ipError: true};
    }

    return null;
  }

}
