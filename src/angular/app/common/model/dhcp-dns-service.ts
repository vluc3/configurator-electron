import {DnService} from "./dn-service";

export interface DhcpDnsService extends DnService {
  exploitationZone: string;
  dmzZone: string;
  defaultDnsServers: string[];
  dhcpRangeBegin: string;
  dhcpRangeEnd: string;
}
