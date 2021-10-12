import {AbstractControl, FormGroup, ValidationErrors} from "@angular/forms";
import {ModalService} from "../component/modal/modal.service";
import {HomeModalComponent} from "../../home/home-modal/home-modal.component";
import {Observable} from "rxjs";
import {ModalEvent} from "../component/modal/modal.component";

export function clone<T>(t: T): T {
  const s = JSON.stringify(t);
  return JSON.parse(s);
}

export function copyEntries(to: any, from: any, option?: { ignore: string[] }) {
  if (!to || !from) {
    return;
  }
  Object.entries(from).forEach(([key, value]) => {
    if (!option || option.ignore.indexOf(key) === -1) {
      to[key] = value;
    }
  });
}

export function keypressRegex(event: KeyboardEvent, r: string): boolean {
  const regex = new RegExp(r);
  return regex.test(event.key);
}

export function ipValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;
  if (!isIpValid(value)) {
    return {ipNotValid: {value}};
  }
  return null;
}

export function isIpValid(ip: string): boolean {
  if (!ip) {
    return false;
  }
  const parts = ip.split('.');
  if (parts.length !== 4) {
    return false;
  }
  for (const part of parts) {
    if (part.trim().length === 0 || isNaN(Number(part)) || (part.length > 1 && part.startsWith('0'))) {
      return false;
    }
    const n = Number(part);
    if (n < 0 || n > 255) {
      return false;
    }
  }
  return true;
}

export function isFormValid(key: string, formGroup: FormGroup) {
  if (formGroup && !formGroup.controls[key].errors) {
    return true;
  }
  return false;
}

export function home(modalService: ModalService, closable = true): Observable<ModalEvent<any>> {
  return modalService.open<any>({
    title: "TOP_NAV.HOME",
    component: HomeModalComponent,
    width: 600,
    noFooter: true,
    notClosable: !closable,
    data: {}
  });
}
