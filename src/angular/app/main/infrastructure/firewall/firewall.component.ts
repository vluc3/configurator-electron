import {Component, HostBinding, OnInit, ViewEncapsulation} from "@angular/core";
import {StateService} from "../../../common/service/state.service";
import {Firewall} from "../../../common/model/firewall";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {copyEntries, ipValidator, isFormValid} from "../../../common/utils/utils";
import {CoreComponent} from "../../service/abstract/core-component";

@Component({
  selector: "div[firewall]",
  templateUrl: "./firewall.component.html",
  styleUrls: ["./firewall.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FirewallComponent extends CoreComponent implements OnInit {

  @HostBinding('class') clazz = 'firewall service';
  formGroup: FormGroup;

  firewall: Firewall;

  constructor(
    private stateService: StateService
  ) {
    super();
  }

  ngOnInit(): void {

    this.firewall = this.stateService.getCurrent().firewall;
    this.formGroup = new FormGroup({
      name: new FormControl(this.firewall.name),
      dmzIp: new FormControl(this.firewall.dmzIp, [Validators.required, ipValidator]),
      exploitationIp: new FormControl(this.firewall.exploitationIp, [Validators.required, ipValidator])
    });
    this.formGroup.statusChanges.subscribe(status => {
      const valid = status === 'VALID';
      if (valid) {
        copyEntries(this.firewall, this.formGroup.getRawValue());
      }
    });
  }

  isValid(key: string): boolean {
    return isFormValid(key, this.formGroup);
  }
}
