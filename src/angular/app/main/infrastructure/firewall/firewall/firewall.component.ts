import {Component, Input, OnInit, Output, ViewEncapsulation, EventEmitter} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {copyEntries, ipValidator, isFormValid} from "../../../../common/utils/utils";
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
  outputIpLabel: string;

  @Output()
  onUpdated: EventEmitter<Firewall> = new EventEmitter<Firewall>();

  formGroup: FormGroup;

  constructor(
    private firewallService: FirewallService) {
      super();
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl(this.firewall.name, [Validators.required]),
      inputIp: new FormControl(this.firewall.inputIp, [Validators.required, ipValidator]),
      outputIp: new FormControl(this.firewall.outputIp, [Validators.required, ipValidator])
    });

    this.formGroup.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        const firewall: Partial<Firewall> = {};
        copyEntries(firewall, this.formGroup.getRawValue());
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
