import {Host} from "../model/host";
import {Network} from "../model/network";
import {Store} from "../service/state.service";
import {OpenVpnService} from "../model/open-vpn-service";
import {IpSecService, filterAndMapEnabledProtocols, Option} from "../model/ip-sec-service";
import {WireGuardService} from "../model/wire-guard-service";
import {MobileIronService} from "../model/mobile-iron-service";
import {EjbcaService} from "../model/ejbca-service";
import {MatrixService} from "../model/matrix-service";
import {JabberService} from "../model/jabber-service";
import {ToipWebUiService} from "../model/toip-web-ui-service";
import {MailService} from "../model/mail-service";
import {NtpService} from "../model/ntp-service";
import {DhcpDnsService} from "../model/dhcp-dns-service";
import {VirtualMachine} from "../model/virtual-machine";
import {ntpService, proxyService, repoService, serviceOrderMap} from "../data/defaults";
import {getLong, getShort, replace, replaceIpSubHost} from "./utils";
import {ServiceOrder} from "../model/service";
import { OperatingSystemEnum } from "../model/operating-system.enum";

function esx(host: Host): string {
  return `
  ${host.id}:
    servname: ${host.name}
    zone: ${isDmz(host) ? 'DMZ' : 'LOCAL'}
    root_user: "{{ ESX_VAULT.list_esx['${host.id}'].root_user }}"
    root_pass: "{{ ESX_VAULT.list_esx['${host.id}'].root_pass }}"
    adm_ip: ${host.ip}
    adm_vlan: ${isDmz(host) ? 'VLAN_DMZ' : 'VLAN_TOIP'}
    list_int_network:
      ${isDmz(host) ? `int_network_dmz` : `int_network_toip`}: ens192
    datastore: ${host.datastore}
    guest_id: debian11_64Guest
  `;
}

export function esxVars(hosts: Host[]) {
  const esxs = hosts.map(host => esx(host)).join("");
  return `#### ESX servers
ESX:
 list_esx:
  ${esxs}
`;
}

function getIpService(id: string, hosts: Host[], network: Network): string {
  const networkHosts: Host[] = hosts.filter(host => host.network === network)

  for (const host of networkHosts) {
    for (const virtualMachine of host.virtualMachines) {
      const index: number = virtualMachine.services.findIndex(service => {
        return service === id;
      });

      if (index > -1) {
        return virtualMachine.ip;
      }
    }
  }

  return null;
}

function vmVar(host: Host, vm: VirtualMachine, store: Store): string {
  const isNotRepo = vm.services.findIndex(id => id === repoService.id) === -1;

  const serviceOrders: ServiceOrder[] = [];

  // TODO Temporaire 28/01/2022: Test sur ntpService à revoir

  vm.services.forEach(id => {
    if (id !== "ntpService") {
      for (const key in store.services) {
        if (store.services[key].id === id) {
          store.services[key].services.forEach(service => {
            const order = serviceOrderMap.get(service);

            const serviceOrder = {
              name: service,
              order: order
            };

            const index = serviceOrders.findIndex(item => {
              return serviceOrder.name === item.name;
            });

            if (index === -1) {
              serviceOrders.push(serviceOrder);
            }
          });

          break;
        }
      }
    }
  });

  serviceOrders.sort((serviceOrder1: ServiceOrder, serviceOrder2: ServiceOrder) => {
    const order1: number = (serviceOrder1.order) ? serviceOrder1.order : 0;
    const order2: number = (serviceOrder2.order) ? serviceOrder2.order : 0;
    return order1 - order2;
  });

  let services = ``;

  for (const serviceOrder of serviceOrders) {
    services += `
        - ${serviceOrder.name}`;
  }

  const isClient: boolean = (
    vm.services.findIndex(id => id === ntpService.id) === -1
    // && vm.services.findIndex(id => id === proxyService.id) === -1 (vu avec Thierry)
  );

  let [netmask_long_dmz, netmask_short_dmz] = short(Network.DMZ, store);
  let [netmask_long_toip, netmask_short_toip] = short(Network.EXPLOITATION, store);

  return `
    ${vm.name}:
      esx: ${host.id}
      disk_size: "{{ ${isNotRepo ? "vars.GLOBAL.disk_size" : "vars.GLOBAL.repo_disk_size"} }}"
      nb_cpu: "{{ ${isNotRepo ? "vars.GLOBAL.nb_cpu" : "vars.GLOBAL.repo_nb_cpu"} }}"
      ram_size: "{{ ${isNotRepo ? "vars.GLOBAL.ram_size" : "vars.GLOBAL.repo_ram_size"} }}"
      ip_digit: ${vm.ip.substring(vm.ip.lastIndexOf(".") + 1)}
      list_ips:
        vlan: ${isDmz(host) ? "VLAN_DMZ" : "VLAN_TOIP"}
        ip: ${vm.ip}
        netmask_short: ${isDmz(host) ? netmask_short_dmz : netmask_short_toip}
      ntp_conf: ${isClient ? "client" : "server"}
      list_system_files:
        << : *defaults
      iso_install: "{{ vars.GLOBAL.${isNotRepo ? (isDmz(host) ? "iso_crypt_proxy" : "iso_crypt") : "iso_crypt_repo"} }}"
      services:${services}
        `;
}

export function globalVars(store: Store) {
  const openVpnService = store.services.openVpnService as OpenVpnService;
  const ipSecService = store.services.ipSecService as IpSecService;
  const wireGuardService = store.services.wireGuardService as WireGuardService;
  const mobileIronService = store.services.mobileIronService as MobileIronService;
  const ejbcaService = store.services.ejbcaService as EjbcaService;
  const matrixService = store.services.matrixService as MatrixService;
  const jabberService = store.services.jabberService as JabberService;
  const toipWebUiService = store.services.toipWebUiService as ToipWebUiService;
  const mailService = store.services.mailService as MailService;
  const ntpService = store.services.ntpService as NtpService;
  const dhcpDnsService = store.services.dhcpDnsService as DhcpDnsService;

  const net_toip_root = store.firewalls.pfsense.outputIp.split(".");
  const net_toip_fw_digit = (net_toip_root?.length >= 3) ? net_toip_root[3] : undefined;
  net_toip_root.splice(3);

  let [netmask_long_toip, netmask_short_toip] = short(Network.EXPLOITATION, store);

  const net_dmz_root = store.firewalls.stormshield.outputIp.split(".");
  net_dmz_root.splice(3);

  const stormshield_to_pfsenses: string[] = store.firewalls.stormshield.outputIp.split(".");
  stormshield_to_pfsenses.splice(3);
  const net_pfsense_stormshield: string = `${stormshield_to_pfsenses.join(".")}.0`;
  const netmask_short_pfsense_stormshield: number = 24

  let [netmask_long_dmz, netmask_short_dmz] = short(Network.DMZ, store);

  let dns_forwarders = ``;
  dhcpDnsService.defaultDnsServers.forEach(dns => {
    dns_forwarders += `
  - ${dns}`;
  });
  let ntp_pool = ``;
  ntpService.defaultNtpServers.forEach(pool => {
    ntp_pool += `
  - ${pool}`;
  });

  const protocol_ike: string = getIpsecProtocol(ipSecService, false);
  const protocol_esp: string = getIpsecProtocol(ipSecService, true);

  let vms = '';
  store.hosts.forEach(host => {
    host.virtualMachines.forEach(vm => {
      vms += vmVar(host, vm, store);
    })
  });

  let vpnClientNetworks: string[] = openVpnService.vpnClientNetwork.split('.');
  vpnClientNetworks[3] = '1';
  const openVpnDefaultServerNetwork: string = vpnClientNetworks.join('.');

  vpnClientNetworks = wireGuardService.vpnClientNetwork.split('.');
  vpnClientNetworks[3] = '1';
  const wireGuardDefaultServerNetwork: string = vpnClientNetworks.join('.');

  return `GLOBAL:

  netmask_long_toip: ${netmask_long_toip}
  netmask_long_dmz: ${netmask_long_dmz}
  netmask_short_toip: ${netmask_short_toip}
  netmask_short_dmz: ${netmask_short_dmz}
  default_toip_ip: ${net_toip_root.join(".")}.222
  default_dmz_ip: ${net_dmz_root.join(".")}.222
  net_toip: ${net_toip_root.join(".")}.0
  net_toip_inv: ${net_toip_root.reverse().join(".")}
  net_dmz: ${net_dmz_root.join(".")}.0
  net_dmz_inv: ${net_dmz_root.reverse().join(".")}
  domain_root: ${dhcpDnsService.domainName.substring(0, dhcpDnsService.domainName.lastIndexOf("."))}
  domain_extension: ${dhcpDnsService.domainName.substring(dhcpDnsService.domainName.lastIndexOf(".") + 1)}
  toip_subdomain: ${dhcpDnsService.exploitationZone}
  dmz_subdomain: ${dhcpDnsService.dmzZone}
  dns_forwarders:${dns_forwarders}
  dhcp_range_start: ${dhcpDnsService.dhcpRangeBegin}
  dhcp_range_end: ${dhcpDnsService.dhcpRangeEnd}
  ntp_pool:${ntp_pool}
  clamsmtp_in_port: ${mailService.antivirusInputPort}
  clamsmtp_out_port: ${mailService.antivirusOutputPort}
  postscreen_port: ${mailService.antispamInputPort}
  imap_haproxy_port: ${mailService.smtpImapInputPort}
  hmdm_port: ${toipWebUiService.interfacePort}
  sbc_external_port: ${toipWebUiService.externSipPort}
  sbc_internal_port: ${toipWebUiService.internSipPort}
  public_sip_port: ${toipWebUiService.externOpenSipPort}
  private_sip_port: ${toipWebUiService.internOpenSipPort}
  organisation: ${ejbcaService.organization}
  locality: ${ejbcaService.city}
  country: ${ejbcaService.country}
  nom_CA: SmvCA
  valid_ca: ${ejbcaService.certificationAuthorityValidityDays}
  valid_cert_srv: ${ejbcaService.certificationServerValidityDays}
  valid_cert_usr: ${ejbcaService.certificationUserValidityDays}
  key_size: ${ejbcaService.length}
  OpenVpn:
    public_ip_ovpn: ${openVpnService.ip}
    default_gw: ${openVpnDefaultServerNetwork}
    openvpn_public_port: ${openVpnService.clientInPort}
    openvpn_port: ${openVpnService.internInPort}
    net_ovpn: ${openVpnService.vpnClientNetwork}
    openvpn_proto: UDP
    nb_cnx_try: ${openVpnService.connectionAttemptsNumber}
    netmask_short: ${openVpnService.netmaskShort}
    netmask_long: ${long(openVpnService.netmaskShort)}
  IPSec:
    public_ip_ipsec: ${ipSecService.ip}
    ipsec_public_port: ${ipSecService.clientInPort}
    authent_time: ${ipSecService.authenticationDuration}
    net_ipsec: ${ipSecService.vpnClientNetwork}
    ipsec_cn: "CN_ROOT_CA"
    nb_cnx_try: ${ipSecService.connectionAttemptsNumber}
    protocol_ike:${protocol_ike}
    protocol_esp:${protocol_esp}
    netmask_short: ${ipSecService.netmaskShort}
    netmask_long: ${long(ipSecService.netmaskShort)}
  wireguard:
    public_ip_wireguard: ${wireGuardService.ip}
    wireguard_server: ${wireGuardDefaultServerNetwork}
    wireguard_public_port: ${wireGuardService.clientInPort}
    wireguard_port: ${wireGuardService.internInPort}
    netmask_short: 24
    net_wireguard: ${wireGuardService.vpnClientNetwork}
    netmask_long: ${long(wireGuardService.netmaskShort)}
    wireguard_backend_port: 3200
  matrix:
    matrix_port: ${matrixService.port}
  jabber:
    jabber_port: ${jabberService.port}
    jabber_port_public: 5222
  fw_toip_ip: ${store.firewalls.pfsense.outputIp}
  fw_toip_ip_digit: ${net_toip_fw_digit}
  proxy_dmz_ip: ${getIpService(proxyService.id, store.hosts, Network.DMZ)}

  #### Pfsense-Stormshield access
  pfsense:
    pfsense_to_stormshield: ${store.firewalls.pfsense.inputIp}
    stormshield_to_pfsense: ${store.firewalls.stormshield.outputIp}
    net_pfsense_stormshield: ${net_pfsense_stormshield}
    netmask_short_pfsense_stormshield: ${netmask_short_pfsense_stormshield}
    itf_dmz_description: ${store.firewalls.pfsense.inputInterfaceDescription}
    itf_dmz: ${store.firewalls.pfsense.inputInterfaceName}
    itf_lan_description: ${store.firewalls.pfsense.outputInterfaceDescription}
    itf_lan: ${store.firewalls.pfsense.outputInterfaceName}



##########################

  mobileiron:
    misync_port: ${mobileIronService.syncPort}
    mi_server_ip: ${mobileIronService.serverIp}
    mi_certif: ${mobileIronService.certificate}
    mi_dns_zone: ${mobileIronService.dnsZone}

  domain_name: "{{ vars.GLOBAL.domain_root }}.{{ vars.GLOBAL.domain_extension }}"

  #MAIL
  mail_virt_pwd: virt
  mail_admin_pwd: admin
  imap_port: 993

  #LDAP
  ldap_root_pass: "{{ LDAP_VAULT.ldap_root_pass }}"
  user_default_pwd: "{{ LDAP_VAULT.user_default_pwd }}"

  #PKI:
  openvpn_private_key_pass: "{{ PKI_VAULT.openvpn_private_key_pass }}"
  strongswan_private_key_pass: "{{ PKI_VAULT.strongswan_private_key_pass }}"
  webui_private_key_pass: "{{ PKI_VAULT.webui_private_key_pass }}"
  webui_frontend_private_key_pass: "{{ PKI_VAULT.webui_private_key_pass }}"
  mariadb_pki_root_pass: "{{ PKI_VAULT.mariadb_pki_root_pass }}"
  matrix_private_key_pass: "{{ PKI_VAULT.matrix_private_key_pass }}"
  jabber_private_key_pass: "{{ PKI_VAULT.jabber_private_key_pass }}"
  nagios_private_key_pass: "{{ PKI_VAULT.nagios_private_key_pass }}"
  wireguard_backend_private_key_pass: "{{ PKI_VAULT.wireguard_backend_private_key_pass }}"
  ldapadmin_private_key_pass: "{{ PKI_VAULT.ldapadmin_private_key_pass }}"
  ldaps_private_key_pass: "{{ PKI_VAULT.ldaps_private_key_pass }}"
  repomirror_private_key_pass: "{{ PKI_VAULT.repomirror_private_key_pass }}"

  #Telecom
  mysql_opensips_root_pass: "{{ TELECOM_VAULT.mysql_opensips_root_pass }}"
  opensips_db_pass: "{{ TELECOM_VAULT.opensips_db_pass }}"
  public_pstn_port: 24684

  #NAGIOS
  nagios_pass: "{{ NAGIOS_VAULT.nagios_pass }}"
  mysql_nagios_root_pass: "{{ NAGIOS_VAULT.mysql_nagios_root_pass }}"
  mysql_ndoutils_pass: "{{ NAGIOS_VAULT.mysql_ndoutils_pass }}"

  #WEBUI:
  webui:
    call_count_port: 8888
    voip_frontend_port: 8080
    voip_backend_port: 3000

  #### EJBCA
  ejbca:
    ejbca_port: 8443
    ejbca_backend_port: 3100

  # Squid
  squid:
    squid_port: 3128

  # Veeam
  veeam:
    port_start: 2500
    port_end: 3300

  opensips_crypt_db_pass: "{{ TELECOM_VAULT.opensips_crypt_db_pass }}"

  ### SSH key
  id_rsa: "/root/.ssh/id_rsa_bulle"

### List System config files by default
  list_system_files_default: &defaults
     ? "/etc/ntp.conf.j2"
     ? "/etc/apt/sources.list.j2"
     ? "/etc/hosts.j2"
     ? "/etc/resolv.conf.j2"
     ? "/etc/apt/apt.conf.d/80ssl-exceptions.j2"

  iso_crypt_repo: "isos/debian-11.3.0-amd64-AUTO-CRYPT-REPO.iso"
  iso_crypt_proxy: "isos/debian-11.3.0-amd64-AUTO-CRYPT-PROXY.iso"
  iso_crypt: "isos/debian-11.3.0-amd64-AUTO-CRYPT.iso"
  iso_windows10: "isos/Windows.iso"

  disk_size: 80
  ram_size: 4096
  nb_cpu: 2

  repo_disk_size: 130
  repo_ram_size: 2048
  repo_nb_cpu: 1

#####################################################
######################################################
#Noms des serveurs
  list_servers:${vms}
  VLANS:
    LOCAL:
      - name: VLAN_TOIP
        vlan_id: 0
        descr: "Vlan Toip"
        priority: 0
        net: ${replaceIpSubHost(store.firewalls.pfsense.outputIp, 0)}
        netmask_short: 24
        interface: ${store.firewalls.pfsense.outputInterfaceName}
        ip: ${store.firewalls.pfsense.outputIp}
        state: present
        vswitch: vSwitch0
    DMZ:
      - name: VLAN_DMZ
        vlan_id: 0
        descr: "Vlan DMZ"
        priority: 0
        net: ${replaceIpSubHost(store.firewalls.pfsense.inputIp, 0)}
        netmask_short: 24
        interface: ${store.firewalls.pfsense.inputInterfaceName}
        ip: ${store.firewalls.pfsense.inputIp}
        state: present
        vswitch: vSwitch0

SERVERS:
#  list_system_files_default: &defaults
#     ? "/etc/ntp.conf.j2"
#     ? "/etc/apt/sources.list.j2"
#     ? "/etc/hosts.j2"
#     ? "/etc/resolv.conf.j2"
#     ? "/etc/apt/apt.conf.d/80ssl-exceptions.j2"
#
  list_servers: "{{ vars.GLOBAL.list_servers }}"

VLANS: "{{ vars.GLOBAL.VLANS }}"
`;
}

function getIpsecProtocol(ipSecService: IpSecService, ignorePseudoRandomFunctions: boolean): string {
  const protocolIkes: string[] = getIpsecProtocols(ipSecService, ignorePseudoRandomFunctions);
  return (protocolIkes.length) ? ` ${protocolIkes.join()}` : '';
}

function getIpsecProtocols(ipSecService: IpSecService, ignorePseudoRandomFunctions: boolean): string[] {
  let result: string[] = [];

  const encryptionAlgorithms: string[] = filterAndMapEnabledProtocols(ipSecService.encryptionAlgorithms, false);
  const pseudoRandomFunctions: string[] = (ignorePseudoRandomFunctions) ? [''] : filterAndMapEnabledProtocols(ipSecService.pseudoRandomFunctions, false);
  const integrities: string[] = filterAndMapEnabledProtocols(ipSecService.integrity, false);
  const diffieHellmans: string[] = filterAndMapEnabledProtocols(ipSecService.diffieHellman, false);

  for (const encryptionAlgorithm of encryptionAlgorithms) {
    for (const pseudoRandomFunction of pseudoRandomFunctions) {
      for (const integrity of integrities) {
        for (const diffieHellman of diffieHellmans) {
          result.push(`${encryptionAlgorithm}-${pseudoRandomFunction}-${integrity}-${diffieHellman}`);
        }
      }
    }
  }

  result = (result
    .map(value => {
      let result: string = replace(value, '--', '-', true);

      if (result?.charAt(0) === '-') {
        result = result.substring(1);
      }

      if (result?.charAt(result.length - 1) === '-') {
        result = result.substring(0, result.length - 1);
      }

      return result;
    }).filter(value => {
      return !! value
    })
  );

  return result;
}

export function hosts(store: Store): string[] {
  let result: string[] = [];

  let entry: string = `localhost ansible_user="{{ DEBIAN_VAULT['localhost'].user | default(DEBIAN_VAULT.user) }}" ansible_ssh_pass="{{ DEBIAN_VAULT['localhost'].pass | default(DEBIAN_VAULT.pass) }}" ansible_become_user="{{ SUDO_VAULT['localhost'].user|default(SUDO_VAULT.to_user) }}" ansible_become_password="{{ DEBIAN_VAULT['localhost'].pass | default(DEBIAN_VAULT.pass) }}" ansible_connection=local`;
  result.push(entry);
  result.push('');

  let section: string = '[groupESX]';
  result.push(section);

  for (const host of store.hosts) {
    const entry: string = `${host.name} ansible_host="{{ vars.ESX.list_esx.${host.id}.adm_ip }}" ansible_python_interpreter="/usr/bin/env python3"`;
    result.push(entry);
  }

  result.push('');
  section = `[groupVMS]`;
  result.push(section);

  for (const host of store.hosts) {
    for (const virtualMachine of host.virtualMachines) {
      if (! isRepoVm(virtualMachine) && virtualMachine.operatingSystem !== OperatingSystemEnum.Windows) {
        const entry: string = addVmEntry(host, virtualMachine);
        result.push(entry);
      }
    }
  }

  result.push('');
  section = `[groupVMS:vars]`;
  result.push(section);

  result.push(`ansible_python_interpreter="/usr/bin/python3"`);
  result.push(`ansible_become_user="{{ SUDO_VAULT.to_user }}"`);
  result.push(`ansible_become_password="{{ DEBIAN_VAULT.pass }}"`);

  result.push('');
  section = `[groupWINDOWS]`;
  result.push(section);
  result.push(`veeam ansible_host="{{ vars.GLOBAL.list_servers['veeam'].list_ips.ip }}"`);

  result.push('');
  section = `[groupWINDOWS:vars]`;
  result.push(section);
  result.push(`ansible_python_interpreter="/usr/bin/python3"`);

  result.push('');
  section = `[groupREPO]`;
  result.push(section);

  for (const host of store.hosts) {
    for (const virtualMachine of host.virtualMachines) {
      if (isRepoVm(virtualMachine)) {
        const entry: string = addVmEntry(host, virtualMachine);
        result.push(entry);
      }
    }
  }

  result.push('');
  section = `[groupREPO:vars]`;
  result.push(section);
  result.push(`ansible_python_interpreter="/usr/bin/python3"`);

  result.push('');

  section = `[groupPfsense]`;
  entry = `${store.firewalls.pfsense.name} ansible_host="{{ vars.GLOBAL.fw_toip_ip }}" ansible_python_interpreter="/usr/local/bin/python3.8" ansible_user="{{ DEBIAN_VAULT['${store.firewalls.pfsense.name}'].user | default(DEBIAN_VAULT.user) }}" ansible_ssh_pass="{{ DEBIAN_VAULT['${store.firewalls.pfsense.name}'].pass | default(DEBIAN_VAULT.pass) }}"`;
  result.push(section);
  result.push(entry);
  result.push('');

  section = `[bulle:children]`;
  entry = `groupVMS`;
  result.push(section);
  result.push(entry);
  result.push('');

  section = `[repobulle:children]`;
  entry = `groupREPO`;
  result.push(section);
  result.push(entry);
  result.push('');

  return result;
}

function isRepoVm(virtualMachine: VirtualMachine): boolean {
  const service: string = virtualMachine.services.find(id => id === repoService.id);
  return !! service;
}

function addVmEntry(host: Host, virtualMachine: VirtualMachine): string {
  return `${virtualMachine.name} ansible_host="{{ vars.GLOBAL.list_servers['${virtualMachine.name}'].list_ips.ip }}" ansible_user="{{ DEBIAN_VAULT['${virtualMachine.name}'].user | default(DEBIAN_VAULT.user) }}" ansible_ssh_pass="{{ DEBIAN_VAULT['${virtualMachine.name}'].pass | default(DEBIAN_VAULT.pass) }}" ansible_become_user="{{ SUDO_VAULT['${virtualMachine.name}'].user|default(SUDO_VAULT.to_user) }}" ansible_become_password="{{ DEBIAN_VAULT['${virtualMachine.name}'].pass | default(DEBIAN_VAULT.pass) }}"`;
}

function short(network: Network, store: Store) {
  let mask = "";
  let short = Number.MAX_VALUE;
  store.hosts.filter(host => host.network === network).forEach(host => {
    host.virtualMachines.forEach(vm => {
      const newShort = getShort(vm.mask);
      if (newShort < short) {
        mask = vm.mask;
        short = newShort;
      }
    });
  });
  return [mask, short];
}

function long(shortMask: number): string {
  return getLong(shortMask)
}

export function getVault(store: Store): string {
  const mailService = store.services.mailService as MailService;
  return `  localhost:
    user: ${store.adminMachine.sudo.login}
    pass: ${store.adminMachine.sudo.password}

  Pfsense:
    user: ${store.firewalls.pfsense.username}
    pass: ${store.firewalls.pfsense.password}

# MAIL
MAIL_VAULT:
  mail_user_defaut_pass: ${mailService.defaultPassword}

${vaultEsx(store.hosts)}`;
}

function vaultEsx(hosts: Host[]): string {
  const esxs = hosts.map(host => {
    return `
  ${host.id}:
    root_user: "root"
    root_pass: "${host.password}"`;
  }).join('');
  return `#### ESX servers
ESX_VAULT:
 list_esx:${esxs}
  `;
}

function isDmz(host: Host): boolean {
  return host.network === Network.DMZ
}
