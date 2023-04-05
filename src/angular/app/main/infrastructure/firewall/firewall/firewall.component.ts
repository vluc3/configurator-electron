import {Component, Input, OnInit, Output, ViewEncapsulation, EventEmitter} from "@angular/core";
import {FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {copyEntries, ipValidator, isFormValid, passwordValidator} from "../../../../common/utils/utils";
import {CoreComponent} from "../../../service/abstract/core-component";

import { Firewall } from "../../../../common/model/firewall";
import { FirewallService } from "../firewall.service";

@Component({
  selector: "app-firewall",
  templateUrl: "./firewall.component.html",
  styleUrls: ["./firewall.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FirewallComponent extends CoreComponent implements OnInit {

  @Input()
  firewall: Firewall;

  @Input()
  networkInputIp: boolean;

  @Input()
  networkOutputIp: boolean;

  @Input()
  inputIpLabel: string;

  @Input()
  inputInterfaceDescriptionLabel: string;

  @Input()
  inputInterfaceNameLabel: string;

  @Input()
  outputIpLabel: string;

  @Input()
  outputInterfaceDescriptionLabel: string;

  @Input()
  outputInterfaceNameLabel: string;

  @Input()
  usernameLabel: string;

  @Input()
  passwordLabel: string;

  @Output()
  onUpdated: EventEmitter<Firewall> = new EventEmitter<Firewall>();

  formGroup: FormGroup;

  showPassword: boolean = false;

  constructor(
    private firewallService: FirewallService) {
      super();
  }

  ngOnInit(): void {
    const inputIpValidators: ValidatorFn[] = (this.inputIpLabel) ? [Validators.required, ipValidator] : [];
    const inputInterfaceDescriptionValidators: ValidatorFn[] = (this.inputInterfaceDescriptionLabel) ? [Validators.required] : [];
    const inputInterfaceNameValidators: ValidatorFn[] = (this.inputInterfaceNameLabel) ? [Validators.required] : [];
    const outputIpValidators: ValidatorFn[] = (this.outputIpLabel) ? [Validators.required, ipValidator] : [];
    const outputInterfaceDescriptionValidators: ValidatorFn[] = (this.outputInterfaceDescriptionLabel) ? [Validators.required] : [];
    const outputInterfaceNameValidators: ValidatorFn[] = (this.outputInterfaceNameLabel) ? [Validators.required] : [];
    const usernameValidators: ValidatorFn[] = (this.usernameLabel) ? [Validators.required] : [];
    const passwordValidators: ValidatorFn[] = (this.passwordLabel) ? [Validators.required] : [];

    this.formGroup = new FormGroup({
      name: new FormControl(this.firewall.name, [Validators.required]),
      inputIp: new FormControl(this.firewall.inputIp, inputIpValidators),
      inputInterfaceDescription: new FormControl(this.firewall.inputInterfaceDescription, inputInterfaceDescriptionValidators),
      inputInterfaceName: new FormControl(this.firewall.inputInterfaceName, inputInterfaceNameValidators),
      outputIp: new FormControl(this.firewall.outputIp, outputIpValidators),
      outputInterfaceDescription: new FormControl(this.firewall.outputInterfaceDescription, outputInterfaceDescriptionValidators),
      outputInterfaceName: new FormControl(this.firewall.outputInterfaceName, outputInterfaceNameValidators),
      username: new FormControl(this.firewall.username, usernameValidators),
      password: new FormControl(this.firewall.password, passwordValidators),
      passwordConfirmation: new FormControl(this.firewall.password),
    });

    if (this.passwordLabel) {
      this.formGroup.addValidators(passwordValidator('password', this.formGroup));
    }

    this.formGroup.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        const firewall: Partial<Firewall> = {};
        copyEntries(firewall, this.formGroup.getRawValue(), {ignore: ["passwordConfirmation"]});
        this.onUpdated.emit(<Firewall> firewall);
      }
    });
  }

  isValid(input: HTMLInputElement, networkIp: boolean = false): boolean {
    let result: boolean = isFormValid(input.id, this.formGroup);

    if (result && networkIp) {
      result = this.firewallService.networkValid;
    }

    return result;
  }
}
