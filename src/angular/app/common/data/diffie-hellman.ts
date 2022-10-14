import {Option} from "../model/ip-sec-service";

const diffieHellman: Option[] = [{
  name: "MODP_768",
  enabled: false,
  value: `modp768`
}, {
  name: "MODP_1024",
  enabled: false,
  value: `modp1024`
}, {
  name: "MODP_1536",
  enabled: false,
  value: `modp1536`
}, {
  name: "MODP_2048",
  enabled: false,
  value: `modp2048`
}, {
  name: "MODP_3072",
  enabled: false,
  value: `modp3072`
}, {
  name: "MODP_4096",
  enabled: true,
  value: `modp4096`
}, {
  name: "MODP_6144",
  enabled: false,
  value: `modp6144`
}, {
  name: "MODP_8192",
  enabled: false,
  value: `modp8192`
}];

export default diffieHellman;
