import {DhcpDnsService} from "../model/dhcp-dns-service";
import {NtpService} from "../model/ntp-service";
import {MailService} from "../model/mail-service";
import {ToipWebUiService} from "../model/toip-web-ui-service";
import {EjbcaService} from "../model/ejbca-service";
import {OpenVpnService} from "../model/open-vpn-service";
import {IpSecService} from "../model/ip-sec-service";
import encryptionAlgorithms from "../data/encryptionAlgorithms.json";
import pseudoRandomFunctions from "../data/pseudoRandomFunctions.json";
import integrity from "../data/integrity.json";
import diffieHellman from "../data/diffieHellman.json";
import {RepoService} from "../model/repo-service";
import {ProxyService} from "../model/proxy-service";
import {NrpeService} from "../model/nrpe-service";
import {NagiosService} from "../model/nagios-service";
import {Service} from "../model/service";

export const dhcpDnsService: DhcpDnsService = {
  name: 'DNS/DHCP',
  icon: 'cfg-globe',
  domainName: 'smv-telecom.sl',
  exploitationZone: 'toip',
  dmzZone: 'dmz',
  defaultDnsServers: ['10.0.0.32', '172.24.23.12'],
  dhcpRangeBegin: '192.168.223.160',
  dhcpRangeEnd: '192.168.223.180',
  services: ["dns", "dhcp"]
};

export const ntpService: NtpService = {
  name: 'NTP',
  icon: 'cfg-network-time',
  defaultNtpServers: ['0.fr.pool.ntp.org', '1.fr.pool.ntp.org', '2.fr.pool.ntp.org', '3.fr.pool.ntp.org'],
  services: ["ntp"]
};

export const mailService: MailService = {
  name: 'Mails',
  icon: 'cfg-envelope',
  domainName: 'smv-telecom.sl',
  defaultPassword: 'aaaa',
  antivirusInputPort: 10025,
  antispamInputPort: 10024,
  antivirusOutputPort: 10026,
  smtpImapInputPort: 10993,
  services: ["mail"]
};

export const toipWebUiService: ToipWebUiService = {
  name: 'TOIP/Web UI',
  icon: 'cfg-phone-office',
  domainName: 'smv-telecom.sl',
  webPort: 8080,
  interfacePort: 8080,
  externSipPort: 5080,
  internSipPort: 5090,
  externOpenSipPort: 24680,
  internOpenSipPort: 24682,
  services: ["telecom", "webui", "connector_ldap"]
};

export const ejbcaService: EjbcaService = {
  name: 'EJBCA',
  icon: 'cfg-file-certificate',
  country: 'FR',
  city: 'Paris',
  organization: 'SMV',
  certificationAuthorityValidityDays: 3650,
  certificationServerValidityDays: 3650,
  certificationUserValidityDays: 3650,
  length: 2048,
  services: ["cles"]
};

export const openVpnService: OpenVpnService = {
  name: 'OpenVPN',
  icon: 'cfg-openvpn',
  ip: '192.168.40.150',
  clientInPort: 21194,
  vpnClientNetwork: '192.168.42.0',
  internInPort: 1194,
  connectionAttemptsNumber: 5,
  services: ["vpn"]
};

export const ipSecService: IpSecService = {
  name: 'IPSec',
  icon: 'cfg-ip-lock',
  ip: '192.168.40.151',
  clientInPort: 4500,
  vpnClientNetwork: '192.168.43.0',
  authenticationDuration: 1800,
  connectionAttemptsNumber: 3,
  encryptionAlgorithms,
  pseudoRandomFunctions,
  integrity,
  diffieHellman,
  services: []
};

export const repoService: RepoService = {
  name: "Repo",
  icon: "cfg-debian-repo",
  services: ["repo"]
};

export const proxyService: ProxyService = {
  name: "Proxy",
  icon: "cfg-proxy",
  services: ["proxies", "sbc"]
};

export const nrpeService: NrpeService = {
  name: "Nrpe",
  icon: "cfg-nrpe",
  services: ["nrpe"],
  replicable: true
};

export const nagiosService: NagiosService = {
  name: "Nagios",
  icon: "cfg-nagios",
  services: ["nagios"]
}

export const elkService: Service = {
  name: "Elk",
  icon: "cfg-elk",
  services: ["kibana", "elasticsearch"]
}

export const ldapService: Service = {
  name: "Ldap",
  icon: "cfg-ldap",
  services: ["ldap"]
}
