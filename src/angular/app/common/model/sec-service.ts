import {Service} from "./service";

export interface SecService extends Service {
  ip: string;
  clientInPort: number;
  vpnClientNetwork: string;
  connectionAttemptsNumber: number;
}
