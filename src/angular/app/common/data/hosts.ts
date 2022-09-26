import {Host} from "../model/host";
import {Network} from "../model/network";
import {ipSecService, nrpeService, openVpnService, wireGuardService, proxyService} from "./defaults";

const hosts: Host[] = [{
  name: "esx-1",
  network: Network.DMZ,
  datastore: "datastore1",
  password: "aaaa",
  ip: "192.168.101.10",
  virtualMachines: [{
    name: "srv-proxy",
    ip: "192.168.12.10",
    mask: "255.255.255.0",
    gateway: "192.168.12.1",
    services: [
      openVpnService.id,
      ipSecService.id,
      wireGuardService.id,
      proxyService.id,
      nrpeService.id
    ]
  }]
}];

export default hosts;
