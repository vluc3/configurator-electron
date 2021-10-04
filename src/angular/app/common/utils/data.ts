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
import diffieHelman from "../data/diffieHelman.json";

export const dhcpDnsService: DhcpDnsService = {
  name: 'DNS/DHCP',
  icon: 'cfg-globe',
  domainName: 'smv-telecom.sl',
  exploitationZone: 'toip',
  administrationZone: 'admin',
  dmzZone: 'dmz',
  defaultDnsServers: ['10.0.0.32', '172.24.23.12'],
  dhcpRangeBegin: '192.168.223.160',
  dhcpRangeEnd: '192.168.223.180'
};

export const ntpService: NtpService = {
  name: 'NTP',
  icon: 'cfg-network-time',
  defaultNtpServers: ['0.fr.pool.ntp.org', '1.fr.pool.ntp.org', '2.fr.pool.ntp.org', '3.fr.pool.ntp.org'],
  communicationSystemNtpServer: ['192.168.100.40']
};

export const mailService: MailService = {
  name: 'Mails',
  icon: 'cfg-envelope',
  domainName: 'smv-telecom.sl',
  defaultPassword: 'aaaa',
  antivirusInputPort: 10025,
  antispamInputPort: 10024,
  antivirusOutputPort: 10026,
  smtpImapInputPort: 10993
};

export const toipWebUiService: ToipWebUiService = {
  name: 'TOIP/Web UI',
  icon: 'cfg-phone-office',
  domainName: 'smv-telecom.sl',
  webPort: 8080,
  interfacePort: 8080,
  externSipPort: 5080,
  internSipPort: 5090,
  externOpenSipPort: 24682,
  internOpenSipPort: 24680,
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
  length: 2048
};

export const openVpnService: OpenVpnService = {
  name: 'OpenVPN',
  icon: 'cfg-openvpn',
  ip: '192.168.40.150',
  clientInPort: 21194,
  vpnClientNetwork: '192.168.42.0',
  internInPort: 1194,
  connectionAttemptsNumber: 5
};

export const ipSecService: IpSecService = {
  name: 'IPSec',
  icon: 'cfg-ip-lock',
  ip: '192.168.40.151',
  clientInPort: 4500,
  vpnClientNetwork: '192.168.43.0',
  authenticationTime: 1800,
  connectionAttemptsNumber: 3,
  encryptionAlgorithms,
  pseudoRandomFunctions,
  integrity,
  diffieHelman
};
