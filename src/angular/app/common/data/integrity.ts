import {Option} from "../model/ip-sec-service";

const integrity: Option[] = [
  {
    name: "HMAC_SHA2_256",
    enabled: true,
    value: `sha256`
  },
  {
    name: "HMAC_SHA2_384",
    enabled: false,
    value: `sha384`
  },
  {
    name: "HMAC_SHA2_512",
    enabled: false,
    value: `sha512`
  },
  {
    name: "HMAC_SHA1_160",
    enabled: false,
    value: `sha1`
  },
  {
    name: "HMAC_MD5_128",
    enabled: false,
    value: `md5`
  }
]

export default integrity;
