import {Option} from "../model/ip-sec-service";

const encryptionAlgorithms: Option[] = [
  {
    name: "AES_CBC_128",
    enabled: false,
    value: `aes128`
  },
  {
    name: "AES_CBC_192",
    enabled: false,
    value: `aes192`
  },
  {
    name: "AES_CBC_256",
    enabled: true,
    value: `aes256`
  },
  {
    name: "CAST_128",
    enabled: false,
    value: `cast128`
  },
  {
    name: "AES_GCM_16_128",
    enabled: false,
    value: `aes128gcm128`
  },
  {
    name: "AES_GCM_16_192",
    enabled: false,
    value: `aes192gcm128`
  },
  {
    name: "AES_GCM_16_256",
    enabled: false,
    value: `aes256gcm128`
  },
  {
    name: "DES",
    enabled: false,
    value: `3des`
  },
  {
    name: "3DES_CBC",
    enabled: false,
    value: `3des`
  }];

export default encryptionAlgorithms;
