import {Host} from "../model/host";
import {Network} from "../model/network";
import {ipSecService, nrpeService, openVpnService, proxyService} from "../utils/data";

const hosts: Host[] = [{
  name: "esx-1",
  network: Network.DMZ,
  datastore: "datastore1",
  password: "aaaa",
  ip: "192.168.101.10",
  virtualMachines: [{
    name: "proxy",
    ip: "192.168.12.10",
    mask: "255.255.255.0",
    gateway: "192.168.12.1",
    services: [
      openVpnService,
      ipSecService,
      proxyService,
      {...nrpeService}
    ]
  }]
}];

export default hosts;
