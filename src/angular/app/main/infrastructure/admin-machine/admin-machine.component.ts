import {Component, OnInit, HostBinding, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminMachine, StateService} from "../../../common/service/state.service";
import {isFormValid, passwordValidator} from '../../../common/utils/utils';
import {CoreComponent} from "../../service/abstract/core-component";

@Component({
  selector: 'div[adminMachineService]',
  templateUrl: './admin-machine.component.html',
  styleUrls: ['./admin-machine.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminMachineComponent extends CoreComponent implements OnInit {

  @HostBinding('class') clazz = 'admin-machine service';

  formGroup: FormGroup;

  showPassword: boolean = false;

  get adminMachine(): AdminMachine {
    return this.stateService.getCurrent().adminMachine;
  }

  constructor(
    private stateService: StateService) {
      super();
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      username: new FormControl(this.adminMachine.sudo.login, [Validators.required]),
      password: new FormControl(this.adminMachine.sudo.password, [Validators.required]),
      passwordConfirmation: new FormControl(this.adminMachine.sudo.password),
    });

    this.formGroup.addValidators(passwordValidator('password', this.formGroup));

    this.formGroup.valueChanges.subscribe((value: any) => {
      if (this.formGroup.valid) {
        this.adminMachine.sudo.login = value.username;
        this.adminMachine.sudo.password = value.password;
      }
    });
  }

  isValid(input: HTMLInputElement): boolean {
    return isFormValid(input.id, this.formGroup);
  }
}
