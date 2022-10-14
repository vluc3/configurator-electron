import {Option} from "../model/ip-sec-service";

const pseudoRandomFunctions: Option[] = [
  {
    name: "PRF_HMAC_SHA2_256",
    enabled: true,
    value: `prfsha256`
  },
  {
    name: "PRF_HMAC_SHA2_384",
    enabled: false,
    value: `prfsha384`
  },
  {
    name: "PRF_HMAC_SHA2_512",
    enabled: false,
    value: `prfsha512`
  },
  {
    name: "PRF_HMAC_SHA1",
    enabled: false,
    value: `prfsha1`
  },
  {
    name: "PRF_MD5_128",
    enabled: false,
    value: `prfmd5`
  }
];

export default pseudoRandomFunctions;
