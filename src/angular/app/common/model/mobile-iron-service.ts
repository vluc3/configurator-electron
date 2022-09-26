import { Service } from "./service";

export interface MobileIronService extends Service {
  serverIp: string;
  syncPort: number;
  certificate: string;
  dnsZone: string;
}
