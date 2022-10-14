import {SecService} from "./sec-service";

export interface IpSecService extends SecService {
  authenticationDuration: number;
  encryptionAlgorithms: Option[];
  pseudoRandomFunctions: Option[];
  integrity: Option[];
  diffieHellman: Option[];
}

export interface Option {
  name: string;
  enabled: boolean;
  value: string;
}

export function filterAndMapEnabledProtocols(protocols: Option[], canBeEmpty: boolean = true): string[] {
  const result: string[] = (protocols
    .filter(protocol => protocol.enabled)
    .map(protocol => protocol.value)
  );

  if (! canBeEmpty && ! result.length) {
    result.push('');
  }

  return result;
}

