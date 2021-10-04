import {Service} from "./service";

export interface EjbcaService extends Service {
  country: string;
  city: string;
  organization: string;
  certificationAuthorityValidityDays: number;
  certificationServerValidityDays: number;
  certificationUserValidityDays: number;
  length: number;
}
