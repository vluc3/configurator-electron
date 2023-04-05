import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {ModalService} from "../component/modal/modal.service";
import {HomeModalComponent} from "../../home/home-modal/home-modal.component";
import {Observable} from "rxjs";
import {ModalEvent} from "../component/modal/modal.component";
import {appConfig} from "../../../environments/environment";

export const intRegex: string = '^[0-9]+$';
export const intAlphaSeparatorRegex: string = '^[0-9a-zA-Z-_\.]+$';
export const alphaSeparatorRegex: string = '^[A-Za-zÀÂÄÀÉÈÊËÌÎÏÒÔÖÙÛÜÇàâäàéèêëìîïòôöùûüç-]+$';
export const ipRegex: string = '^[0-9\.]+$';

export function clone<T>(t: T): T {
  const s = JSON.stringify(t);
  return JSON.parse(s);
}

export function copyEntries(to: any, from: any, option?: { ignore: string[] }) {
  if (!to || !from) {
    return;
  }
  Object.entries(from).forEach(([key, value]) => {
    if (!option || !option.ignore || option.ignore.indexOf(key) === -1) {
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
  if (!isIpValid(value, false)) {
    return {ipNotValid: {value}};
  }
  return null;
}

export function networkIpValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;
  if (!isIpValid(value)) {
    return {ipNotValid: {value}};
  }
  return null;
}

export function maskIpValidator(control: AbstractControl): ValidationErrors | null {
  return networkIpValidator(control);
}

export function isIpValid(ip: string, canEndWithZero: boolean = true): boolean {
  if (!ip) {
    return true;
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
  if (! canEndWithZero && Number(parts[3]) === 0) {
    return false;
  }

  return true;
}

export function isFormValid(key: string, formGroup: FormGroup) {
  if (formGroup && !formGroup.controls[key].errors) {
    return true;
  }
  return false;
}

export function isNetworkValid(ip: string, gateway: string, mask: string = '255.255.255.0'): boolean {

  if (!isIpValid(ip, false) || !isIpValid(mask) || !isIpValid(gateway, false) || ip === gateway || !isMaskValid(mask)) {
    return false;
  }

  const ipParts = ip.split(".");
  const maskParts = mask.split(".");
  const minParts = [];
  const maxParts = [];
  for (let index = 0; index < 4; index++) {
    minParts[index] = parseInt(ipParts[index]) & parseInt(maskParts[index]);
    maxParts[index] = (parseInt(ipParts[index]) | ~parseInt(maskParts[index])) + 256;
  }
  if (gateway === minParts.join(".") || gateway === maxParts.join(".")) {
    return false;
  }
  const gatewayParts = gateway.split(".");

  for (let index = 0; index < 4; index++) {
    if (gatewayParts[index] >= minParts[index] && gatewayParts[index] <= maxParts[index]) {
      continue;
    }
    return false;
  }
  return true;
}

export function isMaskValid(mask: string): boolean {
  if (mask === null) {
    return false;
  }
  if (!isIpValid(mask)) {
    return false;
  }
  return getShort(mask) !== -1;
}

export function getShort(mask: string): number {
  let d = 24;
  let maskValue = 0;
  const parts = mask.split(".");
  for (let i = 0; i < parts.length; i++) {
    let n = parseInt(parts[i]);
    if (n !== (n & 0xff)) {
      return -1;
    }
    maskValue += n << d;
    d -= 8;
  }
  let pattern = 1;
  let ctr = 0;
  let find = false;
  for (let i = 0; i < 32; i++) {
    if ((maskValue & pattern) !== 0) {
      ctr++;
      find = true;
    } else if (find) {
      return -1;
    }
    pattern <<= 1;
  }
  return ctr;
}

export function getLong(shortMask: number): string {
  var mask=[];

  if (shortMask < 0) {
    shortMask = 0;
  } else if (shortMask > 32) {
    shortMask = 32;
  }

  for(var i = 0; i < 4; i++) {
    var n = Math.min(shortMask, 8);
    mask.push(256 - Math.pow(2, 8 - n));
    shortMask -= n;
  }

  return mask.join('.');
}

export function replaceIpSubHost(ip: string, subHost: number): string {

  try {
    let result: string = null;
    const ips: string[] = ip.split('.');

    if (ips.length > 3) {
      ips.splice(3);
      result = `${ips.join('.')}.${subHost}`;
    }

    return result;
  } catch (error) {
    return null;
  }

}

export function passwordValidator(passwordKey = "password", formGroup: FormGroup): ValidatorFn {
  const validator: ValidatorFn = (_: AbstractControl) => {
    const password = formGroup.get(passwordKey)?.value;
    const passwordConfirmation = formGroup.get('passwordConfirmation')?.value
    return password && passwordConfirmation && password === passwordConfirmation ? null : {passwordConfirmation: true}
  }
  return validator;
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

export function getProjectFolder(): string {
  let projectFolder = './project/';
  if (!appConfig.production) {
    projectFolder = './release/project/';
  }
  return projectFolder;
}


export function jsonStringify<T>(object: T, ignore?: (c: T) => void) {
  const c = clone(object);
  if (ignore) {
    ignore(c);
  }
  return JSON.stringify(c);
}

export function replace(value: string, sources: string | string[], target: string, recursive: boolean = false): string {
  let result: string = value;

  if (result) {
    if (typeof sources === 'string') {
      sources = [sources];
    }

    for (const source of sources) {
      do
        result = result.split(source).join(target);
      while (recursive && result.includes(source));
    }
  }

  return result;
}
