import {SecService} from "./sec-service";

export interface WireGuardService extends SecService {
  internInPort: number;
}
