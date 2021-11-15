import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {MailService} from "../../../common/model/mail-service";
import {ServiceComponent} from "../abstract/service.component";
import {StateService} from "../../../common/service/state.service";
import {ModalService} from "../../../common/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {clone, copyEntries, passwordValidator} from "../../../common/utils/utils";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'div[mailService]',
  templateUrl: './mail-service.component.html',
  styleUrls: ['./mail-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MailServiceComponent extends ServiceComponent implements OnInit {

  @HostBinding('class') clazz = 'mail-service service';

  service: MailService;
  show = false;

  constructor(
    stateService: StateService,
    modalService: ModalService,
    translateService: TranslateService
  ) {
    super(stateService, modalService, translateService, "mailService");
  }

  protected init(): void {
    this.service = clone(this.stateService.getService(this.key)) as MailService;
    this.formGroup = new FormGroup({
      domainName: new FormControl(this.service.domainName, [Validators.required]),
      defaultPassword: new FormControl(this.service.defaultPassword, [Validators.required]),
      passwordConfirmation: new FormControl(this.service.defaultPassword,),
      antivirusInputPort: new FormControl(this.service.antivirusInputPort, [Validators.required]),
      antispamInputPort: new FormControl(this.service.antispamInputPort, [Validators.required]),
      antivirusOutputPort: new FormControl(this.service.antivirusOutputPort, [Validators.required]),
      smtpImapInputPort: new FormControl(this.service.smtpImapInputPort, [Validators.required])
    });
    this.formGroup.addValidators(passwordValidator("defaultPassword", this.formGroup));
  }

  protected copyFromFormGroup() {
    copyEntries(this.service, this.formGroup.getRawValue(), {ignore: ["passwordConfirmation"]});
  }

  // private checkPasswords: ValidatorFn = (_: AbstractControl): ValidationErrors | null => {
  //   const password = this.formGroup?.get('defaultPassword')?.value;
  //   const passwordConfirmation = this.formGroup?.get('passwordConfirmation')?.value
  //   return password && passwordConfirmation && password === passwordConfirmation ? null : {passwordConfirmation: true}
  // }
}
