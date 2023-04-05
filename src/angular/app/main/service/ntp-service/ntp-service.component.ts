import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {NtpService} from "../../../common/model/ntp-service";
import {FormBuilder, FormArray, FormGroup, Validators} from "@angular/forms";
import {clone, copyEntries} from "../../../common/utils/utils";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {ServiceComponent} from "../abstract/service.component";

@Component({
  selector: 'div[ntpService]',
  templateUrl: './ntp-service.component.html',
  styleUrls: ['./ntp-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NtpServiceComponent extends ServiceComponent {

  @HostBinding('class') clazz = 'ntp-service service';

  service: NtpService;

  constructor(
    private formBuilder: FormBuilder,
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "ntpService");
  }

  get defaultNtpServerFormArray(): FormArray {
    return <FormArray> this.formGroup.get('defaultNtpServers');
  }

  protected init(): void {
    this.service = clone(this.stateService.getService('ntpService')) as NtpService;

    this.formGroup = new FormGroup({
      defaultNtpServers: new FormArray([])
    });

    this.addDefaultNtpServers();
  }

  addDefaultNtpServers() {
    for (const defaultNtpServer of this.service.defaultNtpServers) {
      this.addDefaultNtpServer(defaultNtpServer);
    }
  }

  addDefaultNtpServer(defaultNtpServer?: string) {
    const defaultNtpServerformGroup: FormGroup = this.formBuilder.group({
      defaultNtpServer: [defaultNtpServer, Validators.required]
    });

    this.defaultNtpServerFormArray.push(defaultNtpServerformGroup);
  }

  removeDefaultNtpServer(index: number) {
    this.defaultNtpServerFormArray.removeAt(index);
  }

  protected copyFromFormGroup() {
    const rawValue: any = this.formGroup.getRawValue();

    rawValue.defaultNtpServers = rawValue.defaultNtpServers.map((defaultNtpServer: any) => {
      return defaultNtpServer['defaultNtpServer'];
    });

    copyEntries(this.service, rawValue);
  }
}
