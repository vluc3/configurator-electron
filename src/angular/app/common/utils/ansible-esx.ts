import {Host} from "../model/host";
import {Network} from "../model/network";
import {Store} from "../service/state.service";
import {OpenVpnService} from "../model/open-vpn-service";
import {IpSecService} from "../model/ip-sec-service";
import {EjbcaService} from "../model/ejbca-service";
import {ToipWebUiService} from "../model/toip-web-ui-service";
import {MailService} from "../model/mail-service";
import {NtpService} from "../model/ntp-service";
import {DhcpDnsService} from "../model/dhcp-dns-service";
import {VirtualMachine} from "../model/virtual-machine";
import {ntpService, proxyService, repoService, serviceOrderMap} from "../data/defaults";
import {getShort} from "./utils";
import {ServiceOrder} from "../model/service";

function esx(host: Host): string {
  return `
  ${host.id}:
    servname: ${host.name}
    root_user: "{{ ESX_VAULT.list_esx['${host.id}'].root_user }}"
    root_pass: "{{ ESX_VAULT.list_esx['${host.id}'].root_pass }}"
    adm_ip: ${host.ip}
    vlan_network:
      ${host.network === Network.DMZ ? `vlan_dmz: "VLAN_DMZ"` : `vlan_toip: "VLAN_TOIP"`}
    list_int_network:
      ${host.network === Network.DMZ ? `int_network_dmz` : `int_network_toip`}: ens192
    datastore: ${host.datastore}
    guest_id: debian10_64Guest
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
  const isProxy = vm.services.findIndex(id => id === proxyService.id) > -1;

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
    && vm.services.findIndex(id => id === proxyService.id) === -1
  );

  return `
    ${vm.name}:
      esx: ${host.id}
      disk_size: "{{ ${isNotRepo ? "vars.GLOBAL.disk_size" : "vars.GLOBAL.repo_disk_size"} }}"
      nb_cpu: "{{ ${isNotRepo ? "vars.GLOBAL.nb_cpu" : "vars.GLOBAL.repo_nb_cpu"} }}"
      ram_size: "{{ ${isNotRepo ? "vars.GLOBAL.ram_size" : "vars.GLOBAL.repo_ram_size"} }}"
      ip_digit: ${vm.ip.substring(vm.ip.lastIndexOf(".") + 1)}
      list_ips:
        ${host.network === Network.DMZ ? "dmz_ip" : "toip_ip"}:  ${vm.ip}
      ntp_conf: ${isClient ? "client" : "server"}
      list_system_files:
        << : *defaults
      iso_install: "{{ vars.GLOBAL.${isNotRepo ? (isProxy ? "iso_crypt_proxy" : "iso_crypt") : "iso_crypt_repo"} }}"
      services:${services}
        `;
}

export function globalVars(store: Store) {
  const openVpnService = store.services.openVpnService as OpenVpnService;
  const ipSecService = store.services.ipSecService as IpSecService;
  const ejbcaService = store.services.ejbcaService as EjbcaService;
  const toipWebUiService = store.services.toipWebUiService as ToipWebUiService;
  const mailService = store.services.mailService as MailService;
  const ntpService = store.services.ntpService as NtpService;
  const dhcpDnsService = store.services.dhcpDnsService as DhcpDnsService;

  const net_toip_root = store.firewalls.pfsense.outputIp.split(".");
  const net_toip_fw_digit = (net_toip_root?.length >= 3) ? net_toip_root[3] : undefined;
  net_toip_root.splice(3);

  let [netmask_long_toip, netmask_short_toip] = short(Network.EXPLOITATION, store);

  const net_dmz_root = store.firewalls.stormshield.inputIp.split(".");
  const net_dmz_fw_digit = (net_dmz_root?.length >= 3) ? net_dmz_root[3] : undefined;
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

  let protocol_ike = ``;
  [
    ...ipSecService.encryptionAlgorithms.filter(algo => algo.enabled).map(algo => algo.value),
    ...ipSecService.pseudoRandomFunctions.filter(algo => algo.enabled).map(algo => algo.value),
    ...ipSecService.integrity.filter(algo => algo.enabled).map(algo => algo.value),
    ...ipSecService.diffieHellman.filter(algo => algo.enabled).map(algo => algo.value)
  ].forEach(value => {
    protocol_ike += `
    - ${value}`;
  });

  let protocol_esp = ``;
  [
    ...ipSecService.encryptionAlgorithms.filter(algo => algo.enabled).map(algo => algo.value),
    ...ipSecService.integrity.filter(algo => algo.enabled).map(algo => algo.value),
    ...ipSecService.diffieHellman.filter(algo => algo.enabled).map(algo => algo.value)
  ].forEach(value => {
    protocol_esp += `
    - ${value}`;
  });

  let vms = '';
  store.hosts.forEach(host => {
    host.virtualMachines.forEach(vm => {
      vms += vmVar(host, vm, store);
    })
  });

  const vpnClientNetworks: string[] = openVpnService.vpnClientNetwork.split('.');
  vpnClientNetworks[3] = '1';
  const defaultGw: string = vpnClientNetworks.join('.');


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
  webui_port: ${toipWebUiService.webPort}
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
    default_gw: ${defaultGw}
    openvpn_public_port: ${openVpnService.clientInPort}
    openvpn_port: ${openVpnService.internInPort}
    net_ovpn: ${openVpnService.vpnClientNetwork}
    openvpn_proto: UDP
    nb_cnx_try: ${openVpnService.connectionAttemptsNumber}
    netmask_short: ${openVpnService.netmaskShort}
  IPSec:
    public_ip_ipsec: ${ipSecService.ip}
    ipsec_public_port: ${ipSecService.clientInPort}
    authent_time: ${ipSecService.authenticationDuration}
    net_ipsec: ${ipSecService.vpnClientNetwork}
    nb_cnx_try: ${ipSecService.connectionAttemptsNumber}
    protocol_ike:${protocol_ike}
    protocol_esp:${protocol_esp}
    netmask_short: ${ipSecService.netmaskShort}
  fw_toip_ip: ${store.firewalls.pfsense.outputIp}
  fw_toip_ip_digit: ${net_toip_fw_digit}
  fw_dmz_ip: ${store.firewalls.stormshield.inputIp}
  fw_dmz_ip_digit: ${net_dmz_fw_digit}
  proxy_dmz_ip: ${getIpService(proxyService.id, store.hosts, Network.DMZ)}
  repo_toip_ip: ${getIpService(repoService.id, store.hosts, Network.EXPLOITATION)}
  ntp_toip_ip: ${getIpService(ntpService.id, store.hosts, Network.EXPLOITATION)}

  #### Pfsense-Stormshield access
  pfsense_to_stormshield: ${store.firewalls.pfsense.inputIp}
  stormshield_to_pfsense: ${store.firewalls.stormshield.outputIp}
  net_pfsense_stormshield: ${net_pfsense_stormshield}
  netmask_short_pfsense_stormshield: ${netmask_short_pfsense_stormshield}



##########################

  mobileiron:
    misync_port: 9997

  netmask_long_ipsec: 255.255.255.0
  netmask_long_ovpn: 255.255.255.0

  netmask_short_ovpn: 24
  netmask_short_ipsec: 24

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
  mariadb_pki_root_pass: "{{ PKI_VAULT.mariadb_pki_root_pass }}"

  #Telecom
  mysql_opensips_root_pass: "{{ TELECOM_VAULT.mysql_opensips_root_pass }}"
  opensips_db_pass: "{{ TELECOM_VAULT.opensips_db_pass }}"
  public_pstn_port: 24684

  #NAGIOS
  nagios_pass: "{{ NAGIOS_VAULT.nagios_pass }}"
  mysql_nagios_root_pass: "{{ NAGIOS_VAULT.mysql_nagios_root_pass }}"
  mysql_ndoutils_pass: "{{ NAGIOS_VAULT.mysql_ndoutils_pass }}"

  #WEBUI:
  call_count_port: 8888

  # Squid
  squid_port: 3128

  ### SSH key
  id_rsa: "/root/.ssh/id_rsa_bulle"

### List System config files by default
  list_system_files_default: &defaults
     ? "/etc/ntp.conf.j2"
     ? "/etc/apt/sources.list.j2"
     ? "/etc/hosts.j2"
     ? "/etc/resolv.conf.j2"

  iso_crypt_repo: "isos/debian-11.3.0-amd64-AUTO-CRYPT-REPO.iso"
  iso_crypt_proxy: "isos/debian-11.3.0-amd64-AUTO-CRYPT-PROXY.iso"
  iso_crypt: "isos/debian-11.3.0-amd64-AUTO-CRYPT.iso"

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
  `;
}

export function hosts(store: Store): string[] {
  let result: string[] = [];

  for (const host of store.hosts) {
    const section: string = `[${host.name}]`;
    const entry: string = `${host.name} ansible_host="{{ vars.ESX.list_esx.${host.id}.adm_ip }}"`;
    result.push(section);
    result.push(entry);
    result.push('');

    for (const virtualMachine of host.virtualMachines) {
      const section: string = `[${virtualMachine.name}]`;
      const ipProperty: string = (host.network === Network.DMZ) ? 'dmz_ip' : 'toip_ip';
      const entry: string = `${virtualMachine.name} ansible_host="{{ vars.GLOBAL.list_servers['${virtualMachine.name}'].list_ips.${ipProperty} }}"`;
      result.push(section);
      result.push(entry);
      result.push('');
    }
  }

  let section: string = `[localhost]`;
  let entry: string = '127.0.0.1';
  result.push(section);
  result.push(entry);

  result = [].concat(
    result,
    hostChildren(store, 'bulle:children', false),
    hostChildren(store, 'repo:children', true)
  );

  result.push('');
  return result;
}

function hostChildren(store: Store, section: string, isRepoService: boolean): string[] {
  const result: string[] = [];

  result.push('');
  section = `[${section}]`;
  result.push(section);

  for (const host of store.hosts) {
    for (const virtualMachine of host.virtualMachines) {
      const service: string = virtualMachine.services.find(id => id === repoService.id);
      const push: boolean = (isRepoService) ? !! service : ! service;

      if (push) {
        const entry: string = virtualMachine.name;
        result.push(entry);
      }
    }
  }

  return result;
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

export function getVault(store: Store): string {
  const mailService = store.services.mailService as MailService;
  return `

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
