import {Option} from "../model/ip-sec-service";

const integrity: Option[] = [
  {
    name: "HMAC_SHA2_256",
    enabled: true,
    value: `<transform type="INTEG">AUTH_HMAC_SHA2_256_128</transform>`
  },
  {
    name: "HMAC_SHA2_384",
    enabled: false,
    value: `<transform type="INTEG">AUTH_HMAC_SHA2_384_192</transform>`
  },
  {
    name: "HMAC_SHA2_512",
    enabled: false,
    value: `<transform type="INTEG">AUTH_HMAC_SHA2_512_256</transform>`
  },
  {
    name: "HMAC_SHA1_160",
    enabled: false,
    value: `<transform type="INTEG">AUTH_HMAC_SHA1_96</transform>`
  },
  {
    name: "HMAC_MD5_128",
    enabled: false,
    value: `<transform type="INTEG">AUTH_HMAC_MD5_96</transform>`
  }
]

export default integrity;
