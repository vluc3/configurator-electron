import {DhcpDnsService} from "../model/dhcp-dns-service";
import {NtpService} from "../model/ntp-service";
import {MailService} from "../model/mail-service";
import {ToipWebUiService} from "../model/toip-web-ui-service";
import {EjbcaService} from "../model/ejbca-service";
import {MatrixService} from "../model/matrix-service";
import { JabberService } from "../model/jabber-service";
import {OpenVpnService} from "../model/open-vpn-service";
import {IpSecService} from "../model/ip-sec-service";
import {WireGuardService} from "../model/wire-guard-service";
import {MobileIronService} from "../model/mobile-iron-service";
import encryptionAlgorithms from "./encryption-algorithms";
import pseudoRandomFunctions from "./pseudo-random-functions";
import integrity from "./integrity";
import diffieHellman from "./diffie-hellman";
import {RepoService} from "../model/repo-service";
import {ProxyService} from "../model/proxy-service";
import {NrpeService} from "../model/nrpe-service";
import {NagiosService} from "../model/nagios-service";
import {Service} from "../model/service";
import { OperatingSystemEnum } from "../model/operating-system.enum";

export const serviceOrderMap: Map<string, number> = new Map([
  ["mail", 90],
  ["nrpe", 100]
]);

export const draggableDmzServiceIds: string[] = [
  "nrpeService",
  "elkAgentService",
  "ipSecService",
  "openVpnService",
  "wireGuardService",
  "veeamService"
];

export const notDroppableDmzServiceIds: string[] = [
  "ipSecService",
  "openVpnService",
  "wireGuardService"
];

export const dhcpDnsService: DhcpDnsService = {
  id: "dhcpDnsService",
  name: 'DNS/DHCP',
  icon: 'cfg-globe',
  operatingSystem: OperatingSystemEnum.Debian,
  domainName: 'smv-telecom.sl',
  exploitationZone: 'toip',
  dmzZone: 'dmz',
  defaultDnsServers: ['10.0.0.32', '172.24.23.12'],
  dhcpRangeBegin: '192.168.223.160',
  dhcpRangeEnd: '192.168.223.180',
  services: ["dns", "dhcp"]
};

export const ntpService: NtpService = {
  id: "ntpService",
  name: 'NTP',
  icon: 'cfg-network-time',
  operatingSystem: OperatingSystemEnum.Debian,
  defaultNtpServers: ['0.fr.pool.ntp.org', '1.fr.pool.ntp.org', '2.fr.pool.ntp.org', '3.fr.pool.ntp.org'],
  services: ["ntp"]
};

export const mailService: MailService = {
  id: "mailService",
  name: 'Mails',
  icon: 'cfg-envelope',
  operatingSystem: OperatingSystemEnum.Debian,
  domainName: 'smv-telecom.sl',
  defaultPassword: 'aaaa',
  antivirusInputPort: 10025,
  antispamInputPort: 10024,
  antivirusOutputPort: 10026,
  smtpImapInputPort: 10993,
  services: ["mail"]
};

export const toipWebUiService: ToipWebUiService = {
  id: "toipWebUiService",
  name: 'TOIP/Web UI',
  icon: 'cfg-phone-office',
  operatingSystem: OperatingSystemEnum.Debian,
  domainName: 'smv-telecom.sl',
  webPort: 8080,
  interfacePort: 8080,
  externSipPort: 5080,
  internSipPort: 5090,
  externOpenSipPort: 24680,
  internOpenSipPort: 24682,
  services: ["node", "tftp", "telecom", "webui", "connector_ldap"]
};

export const ejbcaService: EjbcaService = {
  id: "ejbcaService",
  name: 'EJBCA',
  icon: 'cfg-file-certificate',
  operatingSystem: OperatingSystemEnum.Debian,
  country: 'FR',
  city: 'Paris',
  organization: 'SMV',
  certificationAuthorityValidityDays: 3650,
  certificationServerValidityDays: 3650,
  certificationUserValidityDays: 3650,
  length: 2048,
  services: ["node", "cles", "ejbcabackend"]
};

export const matrixService: MatrixService = {
  id: "matrixService",
  name: 'Matrix',
  icon: 'cfg-matrix',
  operatingSystem: OperatingSystemEnum.Debian,
  port: 8008,
  services: ['matrix']
};

export const jabberService: JabberService = {
  id: "jabberService",
  name: 'Jabber',
  icon: 'cfg-jabber',
  operatingSystem: OperatingSystemEnum.Debian,
  port: 5222,
  services: ['jabber']
};

export const openVpnService: OpenVpnService = {
  id: "openVpnService",
  name: 'OpenVPN',
  icon: 'cfg-openvpn',
  operatingSystem: OperatingSystemEnum.Debian,
  ip: '192.168.40.150',
  clientInPort: 21194,
  vpnClientNetwork: '192.168.42.0',
  internInPort: 1194,
  connectionAttemptsNumber: 5,
  services: ["vpn"],
  netmaskShort: 24
};

export const ipSecService: IpSecService = {
  id: "ipSecService",
  name: 'IPSec',
  icon: 'cfg-ip-lock',
  operatingSystem: OperatingSystemEnum.Debian,
  ip: '192.168.40.151',
  notDeployable: true,
  clientInPort: 4500,
  vpnClientNetwork: '192.168.43.0',
  authenticationDuration: 1800,
  connectionAttemptsNumber: 3,
  encryptionAlgorithms,
  pseudoRandomFunctions,
  integrity,
  diffieHellman,
  services: ['strongswan'],
  netmaskShort: 24
};

export const wireGuardService: WireGuardService = {
  id: "wireGuardService",
  name: 'WireGuard',
  icon: 'cfg-wire-guard',
  operatingSystem: OperatingSystemEnum.Debian,
  ip: '192.168.40.152',
  clientInPort: 51820,
  vpnClientNetwork: '192.168.45.0',
  internInPort: 51820,
  services: ["node", "wireguard", "wireguardbackend"],
  netmaskShort: 24
};

export const mobileIronService: MobileIronService = {
  id: "mobileIronService",
  name: 'MobileIron',
  icon: 'cfg-mobile-iron',
  operatingSystem: OperatingSystemEnum.Debian,
  hidden: true,
  serverIp: '192.168.223.215',
  syncPort: 9997,
  certificate:'mobileironsmv',
  dnsZone: 'ddns.net',
  services: []
};

export const repoService: RepoService = {
  id: "repoService",
  name: "Repo",
  icon: "cfg-debian-repo",
  operatingSystem: OperatingSystemEnum.Debian,
  services: ["repo"]
};

export const proxyService: ProxyService = {
  id: "proxyService",
  name: "Proxy",
  icon: "cfg-proxy",
  operatingSystem: OperatingSystemEnum.Debian,
  services: ["proxies", "sbc"]
};

export const nrpeService: NrpeService = {
  id: "nrpeService",
  name: "Nrpe",
  icon: "cfg-nrpe",
  services: ["nrpe"],
  operatingSystem: OperatingSystemEnum.Debian,
  replicable: true
};

export const nagiosService: NagiosService = {
  id: "nagiosService",
  name: "Nagios",
  icon: "cfg-nagios",
  operatingSystem: OperatingSystemEnum.Debian,
  services: ["nagios"]
}

export const elkService: Service = {
  id: "elkService",
  name: "Elk",
  icon: "cfg-elastic",
  operatingSystem: OperatingSystemEnum.Debian,
  services: ["elasticsearch", "kibana"]
}

export const elkAgentService: Service = {
  id: "elkAgentService",
  name: "Agents Elk",
  icon: "cfg-elastic",
  operatingSystem: OperatingSystemEnum.Debian,
  services: ["metricbeat", "filebeat"],
  replicable: true
}

export const ldapService: Service = {
  id: "ldapService",
  name: "Ldap",
  icon: "cfg-ldap",
  operatingSystem: OperatingSystemEnum.Debian,
  services: ["ldap"]
}

export const veeamService: Service = {
  id: "veeamService",
  name: "Veeam",
  icon: "cfg-veeam",
  operatingSystem: OperatingSystemEnum.Windows,
  services: ["veeam"]
}
