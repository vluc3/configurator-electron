import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {StateService} from "../common/service/state.service";
import {ModalService} from "../common/component/modal/modal.service";
import {getShort, home} from "../common/utils/utils";
import {secretPassword, secretVars} from "../common/data/ansible";
import {ElectronService} from "../common/service/electron.service";
import YAML from "yaml";
import {
  dhcpDnsService,
  ejbcaService,
  mailService,
  ntpService,
  openVpnService,
  repoService,
  toipWebUiService
} from "../common/utils/data";
import {MailService} from "../common/model/mail-service";
import {ExportComponent} from "./export/export.component";
import {Network} from "../common/model/network";
import {OpenVpnService} from "../common/model/open-vpn-service";
import {IpSecService} from "../common/model/ip-sec-service";
import {EjbcaService} from "../common/model/ejbca-service";
import {ToipWebUiService} from "../common/model/toip-web-ui-service";
import {NtpService} from "../common/model/ntp-service";
import {DhcpDnsService} from "../common/model/dhcp-dns-service";
import {esxVars, globalVars} from "../common/yaml/ansible-esx";

@Component({
  selector: 'div[topNav]',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopNavComponent implements OnInit {

  @HostBinding("class") clazz = "top-nav bg-dark";

  constructor(
    private stateService: StateService,
    private modalService: ModalService,
    private electronService: ElectronService
  ) {
  }

  ngOnInit(): void {
  }

  home() {
    home(this.modalService).subscribe(close => {
      if (!close.cancel && close.data) {
      }
    });
  }

  export() {
    if (this.electronService.isElectron) {
      this.electronService.dialog.showOpenDialog({
        properties: ['openDirectory']
      }).then(result => {
        if (result.canceled) {
          return;
        }
        this.modalService.open<any>({
          title: "Mot de passe de chiffrement du fichier ansible_secret_vars.yml",
          component: ExportComponent,
          width: 600,
          data: {}
        }).subscribe(close => {
          if (close.cancel) {
            return;
          }
          const dir = result.filePaths[0];
          let vault = new this.electronService.Vault({password: secretPassword});
          vault.decrypt(secretVars).then(decrypt => {
            const vaultObject = YAML.parse(decrypt);
            const mailService = this.stateService.getService("mailService") as MailService;
            vaultObject["MAIL_VAULT"] = {
              mail_user_defaut_pass: mailService.defaultPassword
            };

            const esx = {
              ESX: {
                list_esx: {}
              }
            }
            const esx_secret = {
              list_esx: {}
            };
            this.stateService.getCurrent().hosts.forEach((host, index) => {
              host.id = `esx${index + 1}`;
              esx_secret.list_esx[host.id] = {root_user: "root", root_pass: host.password};
              // esx.ESX.list_esx[host.name] = {
              //   servname: `srv-${host.name}`,
              //   root_user: `{{ ESX_VAULT.list_esx['${host.name}'].root_user }}`,
              //   root_pass: `{{ ESX_VAULT.list_esx['${host.name}'].root_pass }}`,
              //   adm_ip: host.ip,
              //   list_int_network: {
              //     [host.network === Network.DMZ ? "int_network_dmz" : "int_network_toip"]: "ens224"
              //   },
              //   datastore: host.datastore,
              //   default: {
              //     iso_install: "isos/debian-10.5.0-amd64-AUTO-CRYPT.iso",
              //     disk_size: 40,
              //     ram_size: 4096,
              //     nb_cpu: 4
              //   },
              //   guest_id: "debian10_64Guest"
              // };
            });
            vaultObject["ESX_VAULT"] = esx_secret;
            vault = new this.electronService.Vault({password: close.data.password});
            vault.encrypt(YAML.stringify(vaultObject)).then(encrypt => {
              this.electronService.fs.writeFile(
                `${dir}/${ExportComponent.ANSIBLE_SECRET_VARS}`,
                encrypt,
                (err) => {
                  console.error(err);
                }
              );
            });
            this.electronService.fs.writeFile(
              `${dir}/${ExportComponent.ANSIBLE_ESX_VARS}`,
              esxVars(this.stateService.getCurrent().hosts),
              (err) => {
                console.error(err);
              }
            );

            this.electronService.fs.writeFile(
              `${dir}/${ExportComponent.ANSIBLE_GLOBAL_VARS}`,
              `${globalVars(this.stateService.getCurrent())}${this.fixed()}${YAML.stringify(this.getVms()).replace("GLOBAL:", "")}`,
              (err) => {
                console.error(err);
              }
            );
          });
        });
      });
    }
  }

  save() {
    this.stateService.save();
  }

  private getGlobal() {
    const openVpnService = this.stateService.getService("openVpnService") as OpenVpnService;
    const ipSecService = this.stateService.getService("ipSecService") as IpSecService;
    const ejbcaService = this.stateService.getService("ejbcaService") as EjbcaService;
    const toipWebUiService = this.stateService.getService("toipWebUiService") as ToipWebUiService;
    const mailService = this.stateService.getService("mailService") as MailService;
    const ntpService = this.stateService.getService("ntpService") as NtpService;
    const dhcpDnsService = this.stateService.getService("dhcpDnsService") as DhcpDnsService;
    const net_toip_root = this.stateService.getCurrent().firewall.exploitationIp.split(".");
    const fw_toip_ip_digit = net_toip_root.pop();
    let [netmask_long_toip, netmask_short_toip] = this.getShort(Network.EXPLOITATION);
    const net_dmz_root = this.stateService.getCurrent().firewall.dmzIp.split(".");
    const fw_dmz_ip_digit = net_dmz_root.pop();
    let [netmask_long_dmz, netmask_short_dmz] = this.getShort(Network.DMZ);
    const global = {
      net_toip_root: net_toip_root.join("."),
      net_toip_inv: net_toip_root.reverse().join("."),
      netmask_long_toip,
      netmask_short_toip,
      net_dmz_root: net_dmz_root.join("."),
      net_dmz_inv: net_dmz_root.reverse().join(),
      netmask_long_dmz,
      netmask_short_dmz,
      fw_toip_ip_digit,
      fw_dmz_ip_digit,

      domain_root: dhcpDnsService.domainName.substring(0, dhcpDnsService.domainName.lastIndexOf(".")),
      domain_extension: dhcpDnsService.domainName.substring(dhcpDnsService.domainName.lastIndexOf(".") + 1),
      toip_subdomain: dhcpDnsService.exploitationZone,
      // admin_subdomain: dhcpDnsService.administrationZone,
      dmz_subdomain: dhcpDnsService.dmzZone,
      dns_forwarders: dhcpDnsService.defaultDnsServers,
      dhcp_range_start: dhcpDnsService.dhcpRangeBegin,
      dhcp_range_end: dhcpDnsService.dhcpRangeEnd,
      ntp_pool: ntpService.defaultNtpServers,
      clamsmtp_in_port: mailService.antivirusInputPort,
      clamsmtp_out_port: mailService.antivirusOutputPort,
      postscreen_port: mailService.antispamInputPort,
      imap_haproxy_port: mailService.smtpImapInputPort,
      hmdm_port: toipWebUiService.interfacePort,
      webui_port: toipWebUiService.webPort,
      sbc_external_port: toipWebUiService.externSipPort,
      sbc_internal_port: toipWebUiService.internSipPort,
      public_sip_port: toipWebUiService.externOpenSipPort,
      private_sip_port: toipWebUiService.internOpenSipPort,
      organisation: ejbcaService.organization,
      locality: ejbcaService.city,
      country: ejbcaService.country,
      valid_ca: ejbcaService.certificationAuthorityValidityDays,
      valid_cert_srv: ejbcaService.certificationServerValidityDays,
      valid_cert_usr: ejbcaService.certificationUserValidityDays,
      key_size: ejbcaService.length,
      OpenVpn: {
        public_ip_ovpn: openVpnService.ip,
        openvpn_public_port: openVpnService.clientInPort,
        openvpn_port: openVpnService.internInPort,
        net_ovpn: openVpnService.vpnClientNetwork,
        nb_cnx_try: openVpnService.connectionAttemptsNumber
      },
      IPSec: {
        public_ip_ipsec: ipSecService.ip,
        ipsec_public_port: ipSecService.clientInPort,
        authent_time: ipSecService.authenticationDuration,
        net_ipsec: ipSecService.vpnClientNetwork,
        nb_cnx_try: ipSecService.connectionAttemptsNumber,
        protocol_ike: [
          ...ipSecService.encryptionAlgorithms.filter(algo => algo.enabled).map(algo => algo.value),
          ...ipSecService.pseudoRandomFunctions.filter(algo => algo.enabled).map(algo => algo.value),
          ...ipSecService.integrity.filter(algo => algo.enabled).map(algo => algo.value),
          ...ipSecService.diffieHellman.filter(algo => algo.enabled).map(algo => algo.value)
        ],
        protocol_esp: [
          ...ipSecService.encryptionAlgorithms.filter(algo => algo.enabled).map(algo => algo.value),
          ...ipSecService.integrity.filter(algo => algo.enabled).map(algo => algo.value),
          ...ipSecService.diffieHellman.filter(algo => algo.enabled).map(algo => algo.value)
        ]
      }
    };
    return {GLOBAL: global};
  }

  private getShort(network: Network) {
    let mask = "";
    let short = Number.MAX_VALUE;
    this.stateService.getCurrent().hosts.filter(host => host.network === network).forEach(host => {
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

  getVms() {
    const ret = {
      list_servers: {}
    }
    this.stateService.getCurrent().hosts.forEach(host => {
      host.virtualMachines.forEach(vm => {
        const isNotRepo = vm.services.findIndex(service => service.name === repoService.name) === -1;
        ret.list_servers[vm.name] = {
          esx: host.name,
          disk_size:  `{{ ${isNotRepo ? "vars.GLOBAL.disk_size" : "vars.GLOBAL.repo_disk_size"} }}`,
          nb_cpu:  `{{ ${isNotRepo ? "vars.GLOBAL.nb_cpu" : "vars.GLOBAL.repo_nb_cpu"} }}`,
          ram_size:  `{{ ${isNotRepo ? "vars.GLOBAL.ram_size" : "vars.GLOBAL.repo_ram_size"} }}`,
          list_ips: {
            [host.network === Network.DMZ ? "dmz_ip" : "toip_ip"]: vm.ip,
          },
          ntp_conf: vm.services.findIndex(service => service.name === ntpService.name) === -1 ? "client" : "server",
          list_system_files: {
            "<<": "*defaults"
          },
          iso_install: `{{ ${isNotRepo ? "vars.GLOBAL.iso_crypt" : "vars.GLOBAL.iso_crypt_repo"} }}`,
          services: vm.services.map(service => service.name)
        }
      });
    })

    return {GLOBAL: ret};
  }

  private fixed(): string {
    return `
##########################

  netmask_long_ipsec: 255.255.255.0
  netmask_long_ovpn: 255.255.255.0

  domain_name: "{{ vars.GLOBAL.domain_root }}.{{ vars.GLOBAL.domain_extension }}"

  # IP publique de la box => n'existe plus, remplacé par
  # OpenVpn.public_ip_ovpn et IPSec.public_ip_ipsec
  box_public_ip: "{{ vars.GLOBAL.OpenVpn.public_ip_ovpn }}"

  net_adm: "{{ vars.GLOBAL.net_adm_root }}.0"
  net_toip: "{{ vars.GLOBAL.net_toip_root }}.0"
  net_dmz: "{{ vars.GLOBAL.net_dmz_root }}.0"

  # remplacé par OpenVpn.net_ovpn
  net_ovpn: "{{ vars.GLOBAL.OpenVpn.net_ovpn }}"

  # remplacé par IPSec.net_ipsec
  net_ipsec: "{{ vars.GLOBAL.IPSec.net_ipsec }}"

  # remplacé par netmask_long_admin, netmask_long_toip, netmask_long_dmz
  # netmask_long: 255.255.255.0
  netmask_long: "{{ vars.GLOBAL.netmask_long_admin }}"

  # remplacé par netmask_short_admin, netmask_short_toip, netmask_short_dmz
  netmask_short: "{{ vars.GLOBAL.netmask_short_admin }}"

  #Adresse d'install
  ipaddr_install: "{{ vars.GLOBAL.net_adm_root }}.222"

  #MAIL
  mail_virt_pwd: virt
  mail_admin_pwd: admin
  imap_port: 993

  #LDAP
  ldap_root_pass: "{{ LDAP_VAULT.ldap_root_pass }}"
  user_default_pwd: "{{ LDAP_VAULT.user_default_pwd }}"

  #HMDM
  hmdm_base_name: hmdm
  hmdm_base_user: hmdm
  hmdm_base_pass: hmdm

  #PKI:
  openvpn_private_key_pass: "{{ PKI_VAULT.openvpn_private_key_pass }}"
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

  #VPN
  # remplacé par OpenVpn.openvpn_port
  # openvpn_port: 1194
  openvpn_port: "{{ vars.GLOBAL.OpenVpn.openvpn_port }}"

  #WEBUI:
  # remplacé par OpenVpn.openvpn_public_port
  # openvpn_public_port: 21194
  openvpn_public_port: "{{ vars.GLOBAL.OpenVpn.openvpn_public_port }}"
  call_count_port: 8888

  #Réseau toip
  fw_toip_ip:  "{{ vars.GLOBAL.net_toip_root }}.{{ vars.GLOBAL.fw_toip_ip_digit }}"

  #Réseau DMZ
  fw_dmz_ip: "{{ vars.GLOBAL.net_dmz_root }}.{{ vars.GLOBAL.fw_dmz_ip_digit }}"

  # Squid
  squid_port: 3128

  # EJBCA
  nom_CA: SmvCA

### List System config files by default
  list_system_files_default: &defaults
     ? "/etc/ntp.conf.j2"
     ? "/etc/apt/sources.list.j2"
     ? "/etc/hosts.j2"
     ? "/etc/resolv.conf.j2"

  iso_crypt_repo: "isos/debian-10.5.0-amd64-AUTO-CRYPT-REPO.iso"
  iso_crypt: "isos/debian-10.5.0-amd64-AUTO-CRYPT.iso"

  disk_size: 50
  ram_size: 4096
  nb_cpu: 2

  repo_disk_size: 130
  repo_ram_size: 2048
  repo_nb_cpu: 1

#####################################################
######################################################
#Noms des serveurs
`;
  }
}
