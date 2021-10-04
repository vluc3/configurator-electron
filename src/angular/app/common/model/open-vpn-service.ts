import {SecService} from "./sec-service";

export interface OpenVpnService extends SecService {
  internInPort: number;
}
