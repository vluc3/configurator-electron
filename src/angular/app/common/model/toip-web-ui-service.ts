import {DnService} from "./dn-service";

export interface ToipWebUiService extends DnService {
  webPort: number;
  interfacePort: number;
  externSipPort: number;
  internSipPort: number;
  externOpenSipPort: number;
  internOpenSipPort: number;
}
