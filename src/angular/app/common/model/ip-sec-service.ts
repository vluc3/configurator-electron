import {SecService} from "./sec-service";

export interface IpSecService extends SecService {
  authenticationDuration: number;
  encryptionAlgorithms: Option[];
  pseudoRandomFunctions: Option[];
  integrity: Option[];
  diffieHelman: Option[];
}

export interface Option {
  name: string;
  enabled: boolean;
}
